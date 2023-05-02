import {
  type Db,
  express,
  hkdf,
  jwtDecrypt,
  type JWTPayload,
  load,
  MongoClient,
  type NextFunction,
  Octokit,
  type Request,
  type Response,
} from "./deps.ts";
import type {
  FacebookPost,
  GithubPost,
  GithubUser,
  Post,
  Provide,
  Provider,
  User,
} from "./types.ts";

const ENV = { ...await load(), ...await load({ envPath: "./.env.local" }) };

const app = express();
app.use(express.json());
app.use(firewall);
app.use(userProvider);

const mongo = new MongoClient(ENV.MONGO_URI);
await mongo.connect();
const db = mongo.db("off");
const users = db.collection("users");
users.createIndex({ uuid: 1 });

const fetchGithubPosts: Provide = async ({ accessToken }: Provider) => {
  const octokit = new Octokit({ auth: accessToken });
  const userRes = await octokit.request("GET /user") as { data: GithubUser };
  const eventsRes = await octokit.request("GET /users/{username}/events", {
    username: userRes.data.login,
  }) as { data: GithubPost[] };

  return eventsRes.data.map((event) => ({
    provider: "github" as const,
    type: "event",
    id: `github-event-${event.id}`,
    data: event as unknown,
  }));
};

const fetchFacebookPosts: Provide = async ({ accessToken }: Provider) => {
  const data = await fetch(
    `https://graph.facebook.com/me/posts?fields=
    id,
    message,
    created_time,
    type,
    full_picture,
    permalink_url
    &access_token=${accessToken}`,
  );

  const postRes = await data.json() as { data: FacebookPost[] };

  return postRes.data.map((post) => ({
    provider: "facebook" as const,
    type: "post",
    id: `facebook-event-${post.id}`,
    data: post as unknown,
  }));
};

function mergePosts(oldPosts: Post[], newPosts: Post[]): Post[] {
  const postMap = new Map();
  for (const post of [...oldPosts, ...newPosts]) {
    postMap.set(post.id, post);
  }

  return [...postMap.values()];
}

function isUptodate(date: string) {
  const oneHourAgo = Date.now() - (3600 * 1000);
  return new Date(date).getTime() > oneHourAgo;
}

async function setPosts(db: Db, user: User, provider: Provider, posts: Post[]) {
  return await db.collection("users").updateOne(
    { uuid: user.uuid, "providers.name": provider.name },
    {
      $set: { posts },
      $currentDate: { "providers.$.lastFetch": true },
    },
  );
}

async function firewall(req: Request, res: Response, next: NextFunction) {
  try {
    const token: string | undefined = req.get("Authorization");
    if (!token) throw new Deno.errors.PermissionDenied();

    const jwt = token.replace("Bearer ", "");
    const decoded = await decodeJwt(jwt);

    if (!decoded) throw new Deno.errors.PermissionDenied();

    req.body.session = decoded.data;
    next();
  } catch (_error) {
    res.status(401).json({ message: "Unauthenticated" });
  }
}

async function userProvider(req: Request, _res: Response, next: NextFunction) {
  const user = await db.command(
    {
      findAndModify: "users",
      query: { auth: req.body.session },
      update: {
        $setOnInsert: {
          posts: [],
          follows: [],
          providers: [],
          uuid: crypto.randomUUID(),
        },
      },
      upsert: true,
      new: true,
    },
  );
  req.body.session = undefined;
  req.user = user.value;
  next();
}

async function getDerivedKey(secret: string) {
  return await hkdf("sha256", secret, "", "Off Encryption Key", 32);
}

async function decodeJwt(jwt: string) {
  if (!jwt) return undefined;
  const key = await getDerivedKey(ENV.APP_SECRET);
  const decripted = await jwtDecrypt(jwt, key);
  return decripted.payload as JWTPayload & {
    data: Record<string, unknown>;
  };
}

app.get("/", (req, res) => {
  res.json(req.user);
});

app.post("/provider", async (req, res) => {
  const accessToken = req.body.accessToken;
  const name = req.body.provider;

  await db.collection("users").updateOne(
    { uuid: req.user.uuid },
    { $push: { providers: { name, accessToken, lastFetch: null } } },
  );

  res.json({ message: "ok" });
});

app.post("/fetch-facebook-posts", async (req, res) => {
  const provider = req.user.providers.find(({ name }) => name === "facebook");

  if (!provider) {
    return res.status(400).json({ message: "Facebook provider not found" });
  }

  if (provider.lastFetch && isUptodate(provider.lastFetch)) {
    return res.status(400).json({
      message: "Facebook posts already up to date",
    });
  }

  const newPosts = await fetchFacebookPosts(provider);
  const posts = mergePosts(req.user.posts, newPosts);
  await setPosts(db, req.user, provider, posts);

  res.json({ message: "ok" });
});

app.post("/fetch-github-posts", async (req, res) => {
  const provider = req.user.providers.find(({ name }) => name === "github");

  if (!provider) {
    return res.status(400).json({ message: "Github provider not found" });
  }

  if (provider.lastFetch && isUptodate(provider.lastFetch)) {
    return res.status(400).json({ message: "Github posts already up to date" });
  }

  const newPosts = await fetchGithubPosts(provider);
  const posts = mergePosts(req.user.posts, newPosts);
  await setPosts(db, req.user, provider, posts);

  res.json({ message: "ok" });
});

app.get("/users-to-follow", async (req, res) => {
  const usersToFollow = await db.collection<User>("users")
    .find({ uuid: { $ne: req.user.uuid } })
    .toArray();

  const data = usersToFollow.map((user) => ({
    uuid: user.uuid,
    following: req.user.follows.includes(user.uuid),
  }));

  res.json(data);
});

app.post("/follow", async (req, res) => {
  const uuid = req.body.uuid as string;
  const users = db.collection("users");

  await users.updateOne(
    { uuid: req.user.uuid },
    { $push: { follows: uuid } },
  );

  res.json({ message: "ok" });
});

app.get("/feed", async (req, res) => {
  const followedUsers = await db.collection<User>("users")
    .find({ uuid: { $in: req.user.follows } })
    .toArray();

  const posts = followedUsers.map((user) => user.posts).flat();

  res.json(posts);
});

app.listen(3000);

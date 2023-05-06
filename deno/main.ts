import {
  type Db,
  express,
  extract,
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
import {
  FacebookPost,
  GithubPost,
  GithubUser,
  OAuthProvider,
  Post,
  Provider,
  RSSPost,
  RSSProvider,
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

const fetchGithubPosts = async ({ accessToken }: OAuthProvider) => {
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

const fetchFacebookPosts = async ({ accessToken }: OAuthProvider) => {
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

const fetchRssPosts = async ({ url, name }: RSSProvider) => {
  const postRes = await extract(url) as { entries: RSSPost[] };
  return postRes.entries.map((post) => ({
    provider: name,
    type: "rss",
    id: `${url}-${post.id}`,
    data: post,
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

async function setWebFeed(
  db: Db,
  user: User,
  provider: Provider,
  posts: Post[],
) {
  return await db.collection("users").updateOne(
    { uuid: user.uuid, "providers.name": provider.name },
    {
      $set: { syndication: posts },
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
          syndication: [],
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

app.post("/provider/oauth", async (req, res) => {
  const accessToken = req.body.accessToken;
  const name = req.body.provider;
  const lastFetch = null;
  const type = "oauth";
  const provider = { name, accessToken, lastFetch, type };

  const result = await db.collection("users").updateOne(
    { uuid: req.user.uuid, "providers.name": name },
    { $set: { "providers.$": provider } },
  );

  if (!result.modifiedCount) {
    await db.collection("users").updateOne(
      { uuid: req.user.uuid },
      { $push: { providers: provider } },
    );
  }

  res.json({ message: "ok" });
});

app.post("/provider/rss", async (req, res) => {
  const url = req.body.url as string;

  try {
    const data = await extract(url);
    const name = data.title;
    const lastFetch = null;
    const type = "rss";
    const provider = { name, url, lastFetch, type };

    const result = await db.collection("users").updateOne(
      { uuid: req.user.uuid, "providers.name": name },
      { $set: { "providers.$": provider } },
    );

    if (!result.modifiedCount) {
      await db.collection("users").updateOne(
        { uuid: req.user.uuid },
        { $push: { providers: provider } },
      );
    }
  } catch {
    res.status(400).json({ message: "RSS feed not found or invalid" });
  }

  res.json({ message: "ok" });
});

app.post("/fetch-facebook-posts", async (req, res) => {
  const provider = req.user.providers.find(({ name }) => name === "facebook");

  if (!provider || provider.type != "oauth") {
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

  if (!provider || provider.type != "oauth") {
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

app.post("/fetch-rss-posts", async (req, res) => {
  const providers = req.user.providers.filter(({ type }) => type === "rss");

  try {
    for (const provider of providers) {
      if ("url" in provider) {
        const newPosts = await fetchRssPosts(provider);
        const posts = mergePosts(req.user.syndication, newPosts);
        await setWebFeed(db, req.user, provider, posts);
      }
    }
    res.json({ message: "ok" });
  } catch {
    res.status(400).json({ message: "RSS feed not found or invalid" });
  }
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

  const posts = followedUsers.map((user) => ({
    user: user.uuid,
    posts: user.posts,
  })).flat();
  const syndication = req.user.syndication;
  const feed = posts.concat(syndication);

  // TODO add a date to each post and sort them

  res.json(feed);
});

app.listen(3000);

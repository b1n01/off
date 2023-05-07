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
  FacebookPostData,
  GithubPostData,
  GithubUser,
  OAuthProvider,
  Post,
  Provider,
  SyndicationProvider,
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

//------
// POSTS
//------

const fetchGithubPosts = async ({ accessToken }: OAuthProvider) => {
  const octokit = new Octokit({ auth: accessToken });
  const userRes = await octokit.request("GET /user") as { data: GithubUser };
  const eventsRes = await octokit.request("GET /users/{username}/events", {
    username: userRes.data.login,
  }) as { data: GithubPostData[] };

  return eventsRes.data.map((post) => ({
    id: `github-${post.id}`,
    type: "oauth",
    provider: "github",
    timestamp: post.created_at ?? new Date().toISOString(),
    data: post,
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

  const postRes = await data.json() as { data: FacebookPostData[] };

  return postRes.data.map((post) => ({
    id: `facebook-${post.id}`,
    type: "oauth",
    provider: "facebook",
    timestamp: post.created_time,
    data: post,
  }));
};

const fetchSyndicationPosts = async ({ url, name }: SyndicationProvider) => {
  const postRes = await extract(url);

  return postRes?.entries?.map((post) => ({
    id: `${url}-${post.id}`,
    type: "syndication",
    provider: name,
    timestamp: new Date(post?.published ?? Date()).toISOString(),
    data: post,
  })) ?? [];
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

async function setOAuthPosts(
  db: Db,
  user: User,
  provider: Provider,
  posts: Post[],
) {
  return await db.collection("users").updateOne(
    { uuid: user.uuid, "providers.name": provider.name },
    {
      $set: { posts },
      $currentDate: { "providers.$.lastFetch": true },
    },
  );
}

async function setSyndicationPosts(
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

//-----
// AUTH
//-----

async function firewall(req: Request, res: Response, next: NextFunction) {
  console.log("auth");
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

//----
// JWT
//----

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

//--------
// ACTIONS
//--------

/** Get the logged user */
app.get("/", (req, res) => {
  // TODO: this is leaking auth data
  res.json(req.user);
});

/** Adds an OAuth provider */
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

/** Adds a syndication provider */
app.post("/provider/syndication", async (req, res) => {
  const url = req.body.url as string;

  try {
    const data = await extract(url);
    const name = data.title;
    const lastFetch = null;
    const type = "syndication";
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
    res.status(400).json({ message: "Syndication feed not found or invalid" });
  }

  res.json({ message: "ok" });
});

/** Fetches posts from facebook provider */
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
  await setOAuthPosts(db, req.user, provider, posts);

  res.json({ message: "ok" });
});

/** Fetches posts from github provider */
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
  await setOAuthPosts(db, req.user, provider, posts);

  res.json({ message: "ok" });
});

/** Fetch post from all syndication providers */
app.post("/fetch-syndication-posts", async (req, res) => {
  const providers = req.user.providers.filter(({ type }) =>
    type === "syndication"
  );

  try {
    for (const provider of providers) {
      if ("url" in provider) {
        const newPosts = await fetchSyndicationPosts(provider);
        const posts = mergePosts(req.user.syndication, newPosts);
        await setSyndicationPosts(db, req.user, provider, posts);
      }
    }
    res.json({ message: "ok" });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Syndication feed not found or invalid" });
  }
});

/**
 * Gets a list of users. Each user it's uuid and wheter it followed by the
 * logged user
 */
app.get("/users", async (req, res) => {
  const users = await db.collection<User>("users")
    .find({ uuid: { $ne: req.user.uuid } })
    .toArray();

  const data = users.map((user) => ({
    uuid: user.uuid,
    following: req.user.follows.includes(user.uuid),
  }));

  res.json(data);
});

/** Follow a user */
app.post("/follow", async (req, res) => {
  const uuid = req.body.uuid as string;
  const users = db.collection("users");

  await users.updateOne(
    { uuid: req.user.uuid },
    { $push: { follows: uuid } },
  );

  res.json({ message: "ok" });
});

/**
 * Returns the user feed. The feed is composed by posts of followed users and
 * by web syndication posts
 */
app.get("/feed", async (req, res) => {
  const followedUsers = await db.collection<User>("users")
    .find({ uuid: { $in: req.user.follows } })
    .toArray();

  const usersPosts = followedUsers.map((user) => (
    user.posts.map((post) => ({
      user: {
        name: user.auth.name,
        uuid: user.uuid,
      },
      ...post,
    }))
  )).flat();

  const syndicationPosts = req.user.syndication;
  const feed = [...usersPosts, ...syndicationPosts];

  feed.sort((a, b) => {
    const aTime = new Date(a.timestamp);
    const bTime = new Date(b.timestamp);
    if (aTime < bTime) return 1;
    if (aTime > bTime) return -1;
    return 0;
  });

  res.json(feed);
});

app.listen(3000);

import { load } from "https://deno.land/std@0.184.0/dotenv/mod.ts";
import { Callback, MongoClient } from "npm:mongodb@5.1";
import express, { Request, Response } from "npm:express@4.18.2";
import * as jose from "https://deno.land/x/jose@v4.13.1/index.ts";
import hkdf from "https://deno.land/x/hkdf@v1.0.4/index.ts";
const ENV = { ...await load(), ...await load({ envPath: "./.env.local" }) };

const app = express();
app.use(express.json());
app.use(firewall);
app.use(userProvider);

const mongo = new MongoClient(ENV.MONGO_URI);
await mongo.connect();
const db = mongo.db("off");

async function firewall(req: Request, res: Request, next: Callback) {
  try {
    const token: string | undefined = req.get("Authorization");
    if (!token) throw new Deno.errors.PermissionDenied();

    const jwt = token.replace("Bearer ", "");
    const decoded = await decodeNextAuthJwt(jwt);

    if (!decoded) throw new Deno.errors.PermissionDenied();

    const { id, provider } = decoded.data;
    req.session = { id, provider };
    next();
  } catch (_error) {
    res.status(401).json({ message: "Unauthenticated" });
  }
}

async function userProvider(req: Request, _res: Request, next: Callback) {
  const user = await db.command(
    {
      findAndModify: "users",
      query: req.session,
      update: { $setOnInsert: { posts: [], follows: [], providers: [] } },
      upsert: true,
      new: true,
    },
  );
  req.user = user.value;
  next();
}

async function getDerivedKey(secret: string) {
  return await hkdf("sha256", secret, "", "Off Encryption Key", 32);
}

async function decodeNextAuthJwt(jwt: string) {
  if (!jwt) return null;
  const key = await getDerivedKey(ENV.APP_SECRET);
  const { payload } = await jose.jwtDecrypt(jwt, key);

  return payload;
}

app.get("/", (req: Request, res: Response) => {
  res.json(req.user);
});

app.post("/adapter", async (req: Request, res: Response) => {
  const accessToken = req.body.accessToken;
  const provider = req.body.provider;
  const users = db.collection("users");
  await users.updateOne(
    { _id: req.user._id },
    { $push: { providers: { provider, accessToken } } },
  );
  res.json({ message: "ok" });
});

app.listen(3000);

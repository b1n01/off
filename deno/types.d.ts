// Mongo
export type User = {
  uuid: string;
  id: string;
  provider: string;
  follows: [string];
  posts: [Post];
  providers: [Provider];
};

export type Provider = {
  name: string;
  accessToken: string;
};

export type Post = {
  [key: string]: number | string | Record<string, unknown>;
};

// Express
declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

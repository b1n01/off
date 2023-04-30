import { NextApiRequest, NextApiResponse } from "next";
import { NextHandler } from "next-connect";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { Strategy as GitHubStrategy } from "passport-github";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { setData } from "lib/server/session";
import { useRepoFromPages } from "lib/server/repo";

const FACEBOOK_CREDENTIALS = {
  clientID: process.env.FACEBOOK_APP_ID as string,
  clientSecret: process.env.FACEBOOK_APP_SECRET as string,
};
const GITHUB_CREDENTIALS = {
  clientID: process.env.GITHUB_APP_ID as string,
  clientSecret: process.env.GITHUB_APP_SECRET as string,
};
const GOOGLE_CREDENTIALS = {
  clientID: process.env.GOOGLE_APP_ID as string,
  clientSecret: process.env.GOOGLE_APP_SECRET as string,
};

const authPassport = new passport.Passport();
const dataPassport = new passport.Passport();

authPassport.use(
  new FacebookStrategy({
    ...FACEBOOK_CREDENTIALS,
    callbackURL: "/api/facebook/auth/callback",
  }, function (_accessToken, _refreshToken, profile, callback) {
    return callback(null, { id: profile.id, provider: "facebook" });
  }),
).use(
  new GitHubStrategy({
    ...GITHUB_CREDENTIALS,
    callbackURL: "/api/github/auth/callback",
  }, function (_accessToken, _refreshToken, profile, callback) {
    return callback(null, { id: profile.id, provider: "github" });
  }),
).use(
  new GoogleStrategy({
    ...GOOGLE_CREDENTIALS,
    callbackURL: "/api/google/auth/callback",
  }, function (_accessToken, _refreshToken, profile, callback) {
    return callback(null, { id: profile.id, provider: "google" });
  }),
);

dataPassport.use(
  new FacebookStrategy({
    ...FACEBOOK_CREDENTIALS,
    callbackURL: "/api/facebook/data/callback",
  }, function (accessToken, _refreshToken, _profile, callback) {
    return callback(null, { accessToken });
  }),
).use(
  new GitHubStrategy({
    ...GITHUB_CREDENTIALS,
    callbackURL: "/api/github/data/callback",
  }, function (accessToken, _refreshToken, _profile, callback) {
    return callback(null, { accessToken });
  }),
);

/** Gets the correct passport based on the scope */
function getPassport(scope: string) {
  switch (scope) {
    case "auth":
      return authPassport;
    case "data":
      return dataPassport;
    default:
      throw new Error("Invalid callback scope: " + scope);
  }
}

/** Parses and validates query params. Returns null if params are invalid */
function parseQuery(request: NextApiRequest) {
  const { scope, provider } = request.query;
  const scopes = ["auth", "data"];
  const providers = ["facebook", "github", "google"];

  if (typeof scope !== "string" || typeof provider !== "string") {
    return null;
  }

  if (!scopes.includes(scope) || !providers.includes(provider)) {
    return null;
  }

  if (scope === "data" && provider === "google") {
    // Google is not a data provider
    return null;
  }

  return { scope, provider };
}

/** Middleware that inits the passport auth flow */
export function authenticate(
  request: NextApiRequest,
  response: NextApiResponse,
  next: NextHandler,
) {
  const params = parseQuery(request);
  if (params) {
    const passport = getPassport(params.scope);
    let options = { session: false, scope: [""] };

    if (params.provider === "google") {
      options.scope = ["profile"];
    }

    passport.authenticate(params.provider, options)(request, response, next);
  } else {
    response.redirect("/404");
  }
}

/** Middleware that handles the passport auth callback */
export async function authenticated(
  request: NextApiRequest & { user: any },
  response: NextApiResponse,
  next: NextHandler,
) {
  const params = parseQuery(request);
  if (params) {
    const { scope, provider } = params;

    /**
     * If scope is auth set user data in session, otherwise send the adapter's
     * access token to the API
     */
    if (scope === "auth") {
      const value = request.user;
      await setData({ value, response });
    } else {
      const accessToken = request.user.accessToken;
      const repo = useRepoFromPages({ request });
      await repo.sendAdapter({ accessToken, provider });
    }

    response.redirect("/");
    next();
  } else {
    response.redirect("/404");
  }
}

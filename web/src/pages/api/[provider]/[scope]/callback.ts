import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { authenticate, authenticated } from "@/lib/server/auth";

const router = createRouter<NextApiRequest & { user: any }, NextApiResponse>();

router
  .get(authenticate)
  .get(authenticated);

export default router.handler();

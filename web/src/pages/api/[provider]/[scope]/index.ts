import { NextApiRequest, NextApiResponse } from "next";
import { createRouter } from "next-connect";
import { authenticate } from "@/lib/server/auth";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(authenticate);

export default router.handler();

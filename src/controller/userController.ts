import { Request, Response } from "express";
import { prisma } from "../prisma.js";

export const getRecords = async (req: Request, res: Response) => {
  const data = await prisma.user.findMany({
    select: {
      id: true,
      firstname: true,
    },
  });
  res.json(data);
};

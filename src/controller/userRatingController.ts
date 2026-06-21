import { Request, Response } from "express";
import { prisma } from "../prisma.js";

class UserRatingController {
  getRecords = async (req: Request, res: Response) => {
    try {
      const data = await prisma.userRating.findMany({
        select: {
          id: true,
          userId: true,
          posterId: true,
          numStars: true,
          createdAt: true,
        },
        orderBy: {
          id: "asc",
        },
      });
      //returnerer data som JSON
      return res.json(data);
    } catch (error) {
      console.error(`Fejl i API kald: ${error}`);
    }
  };
  getRecord = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await prisma.userRating.findUnique({
        select: {
          id: true,
          userId: true,
          posterId: true,
          numStars: true,
          createdAt: true,
        },
        // where clause - Leder efter noget hvor en betingelse er opfyldt
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      console.error(`Kunne ikke hente userRating ${error}`);
    }
  };

  createRecord = async (req: Request, res: Response) => {
    const { userId, posterId, numStars } = req.body;

    if (!userId || !posterId || !numStars) {
      return res.status(400).json({
        message: "userId, posterId, og numStars må ikke være tomme",
      });
    }

    try {
      const data = await prisma.userRating.create({
        data: {
          userId: Number(userId),
          posterId: Number(posterId),
          numStars: Number(numStars),
        },
      });
      return res.status(201).json(data);
    } catch (error) {
      console.error(`Kan ikke oprette userRating: ${error}`);
      return res.status(500).json({ message: "Kunne ikke oprette userRating" });
    }
  };

  updateRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { userId, posterId, numStars } = req.body;
    try {
      const data = await prisma.userRating.update({
        where: { id },
        data: {
          userId: Number(userId),
          posterId: Number(posterId),
          numStars: Number(numStars),
        },
      });
      res.send(data);
    } catch (error) {
      console.error(`Kunne ikke opdatere userRating: ${error}`);
      return res
        .status(500)
        .json({ message: "Kunne ikke opdatere userRating" });
    }
  };

  deleteRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.userRating.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `userRating med id ${id} er nu slettet`,
      });
    } catch (error) {
      console.error(`Kunne ikke slette userRating: ${error}`);
      return res.status(500).json({ message: "Kunne ikke slette userRating" });
    }
  };
}
export const userRatingController = new UserRatingController();

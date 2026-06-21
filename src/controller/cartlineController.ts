import { Request, Response } from "express";
import { prisma } from "../prisma.js";

class CartlineController {
  getRecords = async (req: Request, res: Response) => {
    try {
      const data = await prisma.cartline.findMany({
        select: {
          id: true,
          userId: true,
          posterId: true,
          quantity: true,
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
      const data = await prisma.cartline.findUnique({
        select: {
          id: true,
          userId: true,
          posterId: true,
          quantity: true,
          createdAt: true,
        },
        // where clause - Leder efter noget hvor en betingelse er opfyldt
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      console.error(`Kunne ikke hente cartline ${error}`);
    }
  };

  createRecord = async (req: Request, res: Response) => {
    const { userId, posterId, quantity } = req.body;

    if (!userId || !posterId || !quantity) {
      return res.status(400).json({
        message: "userId, posterID, og quantity må ikke være tomme",
      });
    }

    try {
      const data = await prisma.cartline.create({
        data: {
          userId: Number(userId),
          posterId: Number(posterId),
          quantity: Number(quantity),
        },
      });
      return res.status(201).json(data);
    } catch (error) {
      console.error(`Kan ikke oprette cartline: ${error}`);
      return res.status(500).json({ message: "Kunne ikke oprette cartline" });
    }
  };

  updateRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { userId, posterId, quantity } = req.body;
    try {
      const data = await prisma.cartline.update({
        where: { id },
        data: {
          userId: Number(userId),
          posterId: Number(posterId),
          quantity: Number(quantity),
        },
      });
      res.send(data);
    } catch (error) {
      console.error(`Kunne ikke opdatere cartline: ${error}`);
      return res.status(500).json({ message: "Kunne ikke opdatere cartline" });
    }
  };

  deleteRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.cartline.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `cartline med id ${id} er nu slettet`,
      });
    } catch (error) {
      console.error(`Kunne ikke slette cartline: ${error}`);
      return res.status(500).json({ message: "Kunne ikke slette cartline" });
    }
  };
}
export const cartlineController = new CartlineController();

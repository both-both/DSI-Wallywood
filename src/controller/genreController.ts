import { Request, Response } from "express";
import { prisma } from "../prisma.js";

class GenreController {
  getRecords = async (req: Request, res: Response) => {
    try {
      const data = await prisma.genre.findMany({
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
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
      const data = await prisma.genre.findUnique({
        select: {
          id: true,
          title: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
        },
        // where clause - Leder efter noget hvor en betingelse er opfyldt
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      console.error(`Kunne ikke hente genre ${error}`);
    }
  };

  createRecord = async (req: Request, res: Response) => {
    const { title, slug } = req.body;

    if (!title || !slug) {
      return res.status(400).json({
        message: "title og slug må ikke være tomme",
      });
    }

    try {
      const data = await prisma.genre.create({
        data: {
          title: title,
          slug: slug,
        },
      });
      return res.status(201).json(data);
    } catch (error) {
      console.error(`Kan ikke oprette genre: ${error}`);
      return res.status(500).json({ message: "Kunne ikke oprette genre" });
    }
  };

  updateRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { title, slug } = req.body;
    try {
      const data = await prisma.genre.update({
        where: { id },
        data: {
          title: title,
          slug: slug,
        },
      });
      res.send(data);
    } catch (error) {
      console.error(`Kunne ikke opdatere genren: ${error}`);
      return res.status(500).json({ message: "Kunne ikke opdatere genren" });
    }
  };

  deleteRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.genre.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `genre med id ${id} er nu slettet`,
      });
    } catch (error) {
      console.error(`Kunne ikke slette genren: ${error}`);
      return res.status(500).json({ message: "Kunne ikke slette genren" });
    }
  };
}
export const genreController = new GenreController();

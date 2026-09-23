import { Request, Response } from "express";
import { prisma } from "../prisma.js";

const shuffle = <T>(items: T[]) => {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

class PosterController {
  getRecords = async (req: Request, res: Response) => {
    const { genreSlug, limit = 0, random } = req.query;
    try {
      // const data = await prisma.poster.findMany({
      // });
      const data = await prisma.poster.findMany({
        select: {
          id: true,
          name: true,
          slug: true,
          price: true,
          stock: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          description: true,
          genres: {
            select: { title: true },
          },
        },
        orderBy: {
          id: "asc",
        },
        where: genreSlug
          ? { genres: { some: { slug: String(genreSlug) } } }
          : undefined,
      });

      const shuffled = random === "true" ? shuffle(data) : data;

      const result =
        Number(limit) > 0 ? shuffled.slice(0, Number(limit)) : shuffled;

      //returnerer data som JSON
      return res.json(result);
    } catch (error) {
      console.error(`Fejl i API kald: ${error}`);
    }
  };
  getRecord = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const data = await prisma.poster.findUnique({
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          width: true,
          height: true,
          price: true,
          stock: true,
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
      console.error(`Kunne ikke hente poster ${error}`);
    }
  };

  createRecord = async (req: Request, res: Response) => {
    const {
      name,
      slug,
      description,
      image,
      width,
      height,
      price,
      stock,
      genreIds,
    } = req.body;

    if (!name || !slug || !image) {
      return res.status(400).json({
        message: "name, slug og image må ikke være tomme",
      });
    }

    try {
      const data = await prisma.poster.create({
        data: {
          name: name,
          slug: slug,
          description: description,
          image: image,
          width: Number(width),
          height: Number(height),
          price: Number(price),
          stock: Number(stock),
          genres: genreIds
            ? {
                connect: genreIds.map((genreId: number) => ({
                  id: Number(genreId),
                })),
              }
            : undefined,
        },
        include: { genres: true },
      });
      return res.status(201).json(data);
    } catch (error) {
      console.error(`Kan ikke oprette poster: ${error}`);
      return res.status(500).json({ message: "Kunne ikke oprette poster" });
    }
  };

  updateRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const {
      name,
      slug,
      description,
      image,
      width,
      height,
      price,
      stock,
      genreIds,
    } = req.body;
    try {
      const data = await prisma.poster.update({
        where: { id },
        data: {
          name: name,
          slug: slug,
          description: description,
          image: image,
          width: Number(width),
          height: Number(height),
          price: Number(price),
          stock: Number(stock),
          genres: genreIds
            ? {
                set: genreIds.map((genreId: number) => ({
                  id: Number(genreId),
                })),
              }
            : undefined,
        },
        include: { genres: true },
      });
      res.send(data);
    } catch (error) {
      console.error(`Kunne ikke opdatere poster: ${error}`);
      return res.status(500).json({ message: "Kunne ikke opdatere poster" });
    }
  };

  deleteRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.poster.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `poster med id ${id} er nu slettet`,
      });
    } catch (error) {
      console.error(`Kunne ikke slette posteren: ${error}`);
      return res.status(500).json({ message: "Kunne ikke slette posteren" });
    }
  };
}
export const posterController = new PosterController();

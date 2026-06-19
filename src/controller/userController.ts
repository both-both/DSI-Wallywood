import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";

class UserController {
  getRecords = async (req: Request, res: Response) => {
    try {
      const data = await prisma.user.findMany({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          password: true,
          role: true,
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
      const data = await prisma.user.findUnique({
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          password: true,
          role: true,
        },
        // where clause - Leder efter noget hvor en betingelse er opfyldt
        where: {
          id: Number(id),
        },
      });
      return res.status(200).json(data);
    } catch (error) {
      console.error(`Kunne ikke hente brugeren ${error}`);
    }
  };

  createRecord = async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, role, isActive } = req.body;

    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "firstname, lastname, email og password må ikke være tomme",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const data = await prisma.user.create({
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: hashedPassword,
          role: role,
          isActive: Boolean(JSON.parse(isActive)),
        },
      });
      return res.status(201).json(data);
    } catch (error) {
      console.error(`Kan ikke oprette bruger ${error}`);
      return res.status(500).json({ message: "Kunne ikke oprette bruger" });
    }
  };

  updateRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { firstname, lastname, email, password, isActive } = req.body;
    try {
      const data = await prisma.user.update({
        where: { id },
        data: {
          firstname: firstname,
          lastname: lastname,
          email: email,
          password: await bcrypt.hash(password, 10),
          isActive: Boolean(JSON.parse(isActive)),
        },
      });
      res.send(data);
    } catch (error) {
      console.error(`Kunne ikke opdatere brugeren: ${error}`);
      return res.status(500).json({ message: "Kunne ikke opdatere brugeren" });
    }
  };
  deleteRecord = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const data = await prisma.user.delete({
        where: { id },
      });
      return res.status(200).json({
        message: `bruger med id ${id} er nu slettet`,
      });
    } catch (error) {
      console.error(`Kunne ikke slette brugeren: ${error}`);
      return res.status(500).json({ message: "Kunne ikke slette brugeren" });
    }
  };
}
export const userController = new UserController();

import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "../prisma.js";

// Interface til JWT token data - placeres ovenover authController class deklarationen
interface JwtPayload {
  exp: number;
  data: {
    id: number;
    role: string;
  };
}
// Request interface skal udvides med vores user objekt - placeres ovenover authController class deklarationen
declare global {
  namespace Express {
    interface Request {
      user?: { id: number };
    }
  }
}
class AuthController {
  // Middleware til authorization - placeres som ny metode i authController class deklarationen
  authorize = async (req: Request, res: Response, next: NextFunction) => {
    // Henter authorization header
    const bearerHeader = req.headers["authorization"];

    // Tjekker om token starter med Bearer
    if (!bearerHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Token not accepted",
      });
    }

    // Henter token fra header
    const token = bearerHeader.split(" ")[1];
    try {
      // Verificerer token
      const decoded = jwt.verify(
        token,
        process.env.TOKEN_ACCESS_KEY!,
      ) as JwtPayload;
      // Gemmer brugerdata i request
      req.user = decoded.data;
      // Går videre til næste middleware
      return next();
    } catch (error: any) {
      // Returnerer fejl hvis token er ugyldigt
      return res.status(403).json({
        message: error.message,
      });
    }
  };

  generateToken = (
    user: { id: number },
    type: "access" | "refresh", // definerer og det er en access eller refresh token
  ) => {
    // Henter secret key fra .env
    const key = process.env[`TOKEN_${type.toUpperCase()}_KEY`];

    const expiresIn =
      process.env[`TOKEN_${type.toUpperCase()}_EXPIRATION_SECS`];

    // Tjekker om værdier findes
    if (!key || !expiresIn) {
      throw new Error(`Missing env vars for ${type} token`);
    }
    // Beregner token udløbstid
    const exp = Math.floor(Date.now() / 1000) + Number(expiresIn);

    // Opretter JWT token
    return jwt.sign(
      {
        exp,
        data: {
          id: user.id,
        },
      },
      key,
    );
  };

  // Login metode
  authenticate = async (req: Request, res: Response) => {
    // Henter login data fra body
    const { username, password } = req.body;

    // tjekker og data findes
    if (!username || !password) {
      return res.status(400).json({
        message: "Missing credentials",
      });
    }

    try {
      // Finder bruger i databasen
      const user = await prisma.user.findFirst({
        where: {
          email: username,
          isActive: true,
        },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          password: true,
          role: true,
        },
      });
      // Returnerer unauthorized hvis bruger ikke findes
      if (!user) {
        return res.sendStatus(401);
      }

      // Sammenligner password med hash
      const isMatch = await bcrypt.compare(password, user.password);

      //Returnerer unautherized hvis password er forkert
      if (!isMatch) {
        return res.sendStatus(401);
      }
      //Genererer access token
      const accessToken = this.generateToken(user, "access");

      //returnerer token og brugerdata
      return res.json({
        accessToken,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
        },
      });
    } catch (error: any) {
      //Returnerer serverfejl
      return res.status(500).json({
        message: error.message,
      });
    }
  };
}
export const authController = new AuthController();

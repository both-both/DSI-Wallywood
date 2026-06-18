import jwt from "jsonwebtoken";

class AuthController {
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
}
export const authController = new AuthController();

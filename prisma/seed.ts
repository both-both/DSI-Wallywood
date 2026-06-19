import { prisma } from "../src/prisma";
import path from "path";
import { parse } from "csv-parse/sync";
import bcrypt from "bcrypt";
import { fileURLToPath } from "node:url";
import { readFile } from "node:fs/promises";
import { fieldTypes, type FieldType } from "./types";

// De modelnavne som seed-scriptet må arbejde med
type SeedModelName = (typeof order)[number];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// leder i prisma/data
const directory = path.join(__dirname, "data");

// Rækkefølgen er vigtig, fordi poster bruger genre
const order = ["user", "genre", "cartline"];

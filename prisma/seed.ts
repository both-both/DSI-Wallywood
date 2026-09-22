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
const directory = path.join(__dirname, "csv");

// Rækkefølgen er vigtig, fordi cartline/userRating har foreign keys til user og poster
// genrePosterRel seedes separat, da _genreToPoster er en implicit join-tabel uden Prisma-model
const order = ["user", "poster", "genre", "cartline", "userRating"] as const;

const main = async () => {
  try {
    console.log("Clearing current database");
    // Slet i omvendt rækkefølge, så relationer ikke blokerer
    for (const model of [...order].reverse()) {
      console.log(`Deleting model ${model}`);
      await (prisma as any)[model].deleteMany();
    }
    for (const model of order) {
      console.log(`seeding ${model}`);

      const rows = await readCsv(model);
      const cleanedData = await Promise.all(
        rows.map((row) => castRow(model, row)),
      );
      await (prisma as any)[model].createMany({ data: cleanedData });
      console.log(`Seed completed`);
    }
    await seedGenrePosterRel();
  } catch (error) {
    console.error(`Seed Failed: ${error}`);
    // Uanset hvad den laver, disconnecterne den efter trycatch
  } finally {
    await prisma.$disconnect();
  }
};

// Forbinder posters og genres via den implicitte join-tabel _genreToPoster
const seedGenrePosterRel = async () => {
  console.log("seeding genrePosterRel");
  const rows = await readCsv("genrePosterRel");

  for (const row of rows) {
    await prisma.poster.update({
      where: { id: Number(row.posterId) },
      data: { genres: { connect: { id: Number(row.genreId) } } },
    });
  }
  console.log(`Seed completed`);
};

const readCsv = async (model: SeedModelName | "genrePosterRel") => {
  const fullpath = path.join(directory, `${model}.csv`);
  const content = await readFile(fullpath, "utf-8");

  // Første række i CSV-filen bliver brugt som feltnavne
  return parse(content, { columns: true, skip_empty_lines: true }) as Record<
    string,
    any
  >[];
};

const castRow = async (model: SeedModelName, row: Record<string, any>) => {
  const schema = fieldTypes[model] as Record<string, FieldType>;
  const converted: Record<string, any> = {};

  // CSV-værdier er tekst, så de konverteres til de typer Prisma forventer
  for (const [key, value] of Object.entries(row)) {
    const type: FieldType = schema[key || "string"];
    const val = value?.toString().trim();

    if (key === "password") {
      // Passwords gemmes hashed i databasen
      converted[key] = await bcrypt.hash(val, 10);
      continue;
    }

    if (type === "number") converted[key] = Number(val);
    else if (type === "boolean") converted[key] = val === "1" || val === "true";
    else if (type === "date") converted[key] = new Date(val);
    else converted[key] = val;
  }
  return converted;
};
main();

# Wallywood API

Wallywood er en webshop der sælger både nye og gamle filmplakater i alle genrer.

- Skoleprojekt i DSI

## Teknologier

Der er brugt Node.js, TypeScript, Express, Prisma og SQLite.

## Miljøvariabler

Opret en `.env`-fil i roden af projektet med følgende indhold:

```
PORT=4000
DATABASE_URL="file:./dev.db"

# Token Access Key
TOKEN_ACCESS_KEY=myPrivateAccessKey
TOKEN_ACCESS_EXPIRATION_SECS=3600
```

## Installation

1. Installer dependencies:

   ```
   npm install
   ```

2. Opret `.env`-filen som beskrevet ovenfor.

3. Generér Prisma Client:

   ```
   npm run generate
   ```

4. Kør migrationer for at oprette databasen:

   ```
   npm run migrate
   ```

5. Seed databasen med testdata fra CSV-filerne:

   ```
   npm run seed
   ```

6. Start serveren:
   ```
   npm run dev
   ```

Serveren kører nu på `http://localhost:4000`.

## Tilgængelige scripts

| Kommando           | Beskrivelse                                               |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Starter serveren i udviklingstilstand                     |
| `npm run generate` | Genererer Prisma Client ud fra schema.prisma              |
| `npm run migrate`  | Kører/opretter migrationer og opdaterer databasen         |
| `npm run seed`     | Seeder databasen med data fra CSV-filerne i `prisma/csv/` |
| `npm run reset`    | Nulstiller databasen og kører migrationer + seed igen     |
| `npm run build`    | Bygger TypeScript til JavaScript (`dist/`)                |
| `npm run start`    | Starter den byggede version af serveren                   |

## API-dokumentation

Fuld dokumentation af alle endpoints (med eksempler på requests/responses) findes i Postman:

https://documenter.getpostman.com/view/54751225/2sBXwvKpKg

## Login og roller

API'et bruger JWT (JSON Web Tokens) til authentication og authorization.

1. **Login**: Send `POST /login` med `username` (email) og `password`. Ved korrekt login returneres et `accessToken`.
2. **Authentication**: Beskyttede endpoints kræver, at tokenet sendes med i headeren `Authorization: Bearer <accessToken>`.
3. **Authorization**: Kun brugere med rollen `ADMIN` har adgang til at oprette, opdatere eller slette data (POST/PUT/DELETE). Almindelige brugere (`USER`) kan kun hente data (GET).

Testbrugere (fra seed-data):

| Email               | Password | Rolle |
| ------------------- | -------- | ----- |
| info@webudvikler.dk | password | ADMIN |
| alm@webudvikler.dk  | password | USER  |

## Relationen mellem poster og genre

`genrePosterRel` har ikke sit eget CRUD-endpoint, da det er en ren relationstabel (mange-til-mange mellem `poster` og `genre`). I stedet administreres relationen via poster-endpoints: send et `genreIds`-array (en liste af genre-id'er) med i body'en på `POST /posters` eller `PUT /posters/:id`, og API'et opretter/opdaterer relationerne automatisk.

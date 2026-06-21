export type FieldType = "string" | "number" | "boolean" | "date";
export type FieldTypeMap = Record<string, FieldType>;

export const fieldTypes = {
  user: {
    id: "number",
    firstname: "string",
    lastname: "string",
    email: "string",
    password: "string",
    role: "string",
    isActive: "boolean",
  },

  poster: {
    id: "number",
    name: "string",
    slug: "string",
    description: "string",
    image: "string",
    width: "number",
    height: "number",
    price: "number",
    stock: "number",
    createdAt: "date",
    updatedAt: "date",
  },

  genre: {
    id: "number",
    title: "string",
    slug: "string",
    createdAt: "date",
    updatedAt: "date",
  },

  genrePosterRel: {
    genreId: "number",
    posterId: "number",
  },

  cartline: {
    id: "number",
    userId: "number",
    posterId: "number",
    quantity: "number",
    createdAt: "date",
  },

  userRating: {
    id: "number",
    userId: "number",
    posterId: "number",
    numStars: "number",
    createdAt: "date",
  },
} satisfies Record<string, FieldTypeMap>;

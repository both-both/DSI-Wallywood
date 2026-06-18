export type FieldType = "string" | "number" | "boolean" | "date";
export type FieldTypeMap = Record<string, FieldType>;

export const fielTypes = {
  user: {
    id: "number",
    firstname: "string",
    lastname: "string",
    email: "string",
    password: "string",
    role: "string",
    isActive: "boolean",
  },
} satisfies Record<string, FieldTypeMap>;

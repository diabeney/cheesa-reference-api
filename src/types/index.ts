export type Programmes = "Petrochemical" | "Chemical";

export interface IGraduate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  programme: Programmes;
  graduationYear: string;
}

export type ILecturer = Record<
  "firstName" | "lastName" | "email" | "password",
  string
>;

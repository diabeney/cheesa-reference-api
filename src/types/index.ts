export type Programmes = "Petrochemical" | "Chemical";

export interface Graduate {
  firstName: string;
  lastName: string;
  email: string;
  programme: Programmes;
  graduationYear: string;
}

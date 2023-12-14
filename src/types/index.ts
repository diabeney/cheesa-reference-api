export type Programmes = "Petrochemical" | "Chemical";

export type IUser = Record<
  "firstName" | "lastName" | "email" | "password" | "role",
  string
>;

export interface IRecommendationRequest {
  user: Omit<IUser, "password" | "role">;
  programme: Programmes;
  graduationYear: string;
}

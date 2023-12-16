import { Schema, model } from "mongoose";
import { IUser } from "../types";

const UsersSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	role: { type: String, enum: ["lecturer", "graduate"] },
});

const Users = model<IUser>("Users", UsersSchema);

export default Users;

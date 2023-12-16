import { test, expect, describe } from "vitest";
import { validateReqObject } from "../utils";

type MockRequestType = Record<"name" | "email" | "username", string>;

describe("validate request body object", () => {
	describe("given an invalid input", () => {
		test("where a required field is missing", () => {
			expect(
				validateReqObject<MockRequestType>({ name: "test" }, ["name", "email"]),
			).toBeInstanceOf(Error);
		});
		test("where some required field values are invalid", () => {
			expect(
				validateReqObject<MockRequestType>({ name: "test", email: "" }, [
					"name",
					"email",
					"username",
				]),
			).toBeInstanceOf(Error);
		});
	});

	describe("given a valid input", () => {
		test("where there is an additional field to the required ones", () => {
			expect(
				// Intentionally using <any> to suppress typescript warning
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
				validateReqObject<any>(
					{
						name: "valid",
						email: "valid@email.com",
						username: "@valid",
						invalid: "heug",
					},
					["name", "email", "username"],
				),
			).toMatchObject({
				name: "valid",
				email: "valid@email.com",
				username: "@valid",
				invalid: "heug",
			});
		});
	});
});

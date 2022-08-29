import createCustomError from "./error";

describe("Given a function createCustomError", () => {
  const testError = createCustomError(
    404,
    "Endpoint not found",
    "Resource not available"
  );
  describe("When it's call with a code, a private message and a public message as arguments", () => {
    test("Then it should return an error with the status code equal to the argument code", () => {
      const status = 404;
      expect(testError.statusCode).toBe(status);
    });
  });

  test("Then it should return an error with the private message", () => {
    const message = "Resource not available";
    expect(testError.privateMessage).toBe(message);
  });

  test("Then it should return an error with the public message", () => {
    const message = "Endpoint not found";
    expect(testError.publicMessage).toBe(message);
  });
});

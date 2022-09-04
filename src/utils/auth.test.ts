import { verifyToken } from "./auth";

const mockVerify = jest.fn();

jest.mock("jsonwebtoken", () => ({
  verify: (token: string) => mockVerify(token),
}));

describe("Given a verfy token function", () => {
  describe("When it is called with a token", () => {
    test("Then it should call verify method of jwt", () => {
      const token = "127162387284787ue92nsjnfdr3829";

      verifyToken(token);

      expect(mockVerify).toBeCalledWith(token);
    });
  });
});

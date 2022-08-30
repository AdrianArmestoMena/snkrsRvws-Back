import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import signUp from "./usersControllers";

const next = jest.fn() as Partial<NextFunction>;

describe("Given a sign up controller", () => {
  const mockedReqBody = {
    userName: "assddsdsdsdsd",
    password: "asdghf",
    email: "stringas",
  };

  const req = {
    body: mockedReqBody,
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  User.create = jest.fn().mockReturnValue(mockedReqBody);

  describe("When it is called with a Request a Response and a Next fucntion", () => {
    test("Then it should call the status method of the response", async () => {
      await signUp(req as Request, res as Response, next as NextFunction);

      const statusCode = 201;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call the json method of the response", async () => {
      await signUp(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith(mockedReqBody);
    });

    test("It should call the next function with the created error if it wasn't posible to create the user", async () => {
      User.create = jest.fn().mockRejectedValue(new Error());

      await signUp(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });

    test("It should call the next function with the created error if the data does not fulfill contract", async () => {
      const errorReqBody = {
        userName: "a",
        password: "a",
        email: "a",
      };

      const errorReq = {
        body: errorReqBody,
      } as Partial<Request>;

      await signUp(errorReq as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});

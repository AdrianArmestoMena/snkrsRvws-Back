import { NextFunction, Request, Response } from "express";
import { User } from "../database/models/users";
import { Payload } from "../types/payload";
import { createToken } from "../utils/auth";
import { logIn, signUp } from "./usersControllers";

const next = jest.fn() as Partial<NextFunction>;

const hashCompareValue = false;

jest.mock("../utils/auth", () => ({
  ...jest.requireActual("../utils/auth"),
  hashCompare: () => jest.fn().mockReturnValue(hashCompareValue),
  createToken: jest.fn().mockReturnValue(""),
}));

describe("Given a sign up controller", () => {
  const mockedReqBody = {
    userName: "Adrian",
    password: "AdrianArm",
    email: "adrian@adrian",
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

describe("Given a log in controller", () => {
  afterEach(() => jest.restoreAllMocks());

  const mockedReqBody = {
    userName: "Adrian",
    password: "AdrianArm",
  };

  const req = {
    body: mockedReqBody,
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  User.find = jest.fn().mockReturnValue([mockedReqBody]);

  describe("When it is called with a Request a Response and a Next fucntion", () => {
    test("Then it should call the status method of the response", async () => {
      await logIn(req as Request, res as Response, next as NextFunction);

      const statusCode = 200;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call the json method of the response", async () => {
      await logIn(req as Request, res as Response, next as NextFunction);

      const payLoad: Payload = {
        id: "123",
        userName: "asdfghj",
      };

      const responseData = {
        user: { token: createToken(payLoad) },
      };

      expect(res.json).toHaveBeenCalledWith(responseData);
    });

    test("It should call the next function with the created error if the request body does not fulfill contract", async () => {
      mockedReqBody.userName = "a";
      mockedReqBody.password = "a";

      await logIn(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });

    test("It should call the next function with the created error if it wasn't posible to find the user", async () => {
      mockedReqBody.userName = "Adrian";
      mockedReqBody.password = "AdrianArm";

      User.find = jest.fn().mockReturnValue([]);

      await logIn(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });

    test("It should call the next function with the created error if an user find throw an error", async () => {
      mockedReqBody.userName = "Adrian";
      mockedReqBody.userName = "AdrianArm";

      User.find = jest.fn().mockRejectedValue(new Error());

      await logIn(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given a log in controller", () => {
  afterEach(() => jest.restoreAllMocks());

  jest.mock("../utils/auth", () => ({
    ...jest.requireActual("../utils/auth"),
    hashCompare: () => jest.fn().mockReturnValue(false),
    createToken: jest.fn().mockReturnValue(""),
  }));

  const mockedReqBody = {
    userName: "Adrian",
    password: "AdrianArm",
  };

  const req = {
    body: mockedReqBody,
  } as Partial<Request>;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  User.find = jest.fn().mockReturnValue([mockedReqBody]);

  describe("When it is called with a Request a Response and a Next fucntion", () => {
    test("It should call the next function with the created error if an user find throw an edfdsfdrror", async () => {
      mockedReqBody.userName = "Adrian";
      mockedReqBody.userName = "AdrianArm";

      jest.resetAllMocks();

      await logIn(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalled();
    });
  });
});

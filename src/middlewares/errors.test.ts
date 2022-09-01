import { Request, Response } from "express";
import { errors, ValidationError } from "express-validation";
import CustomError from "../types/error";
import { notFoundError, generalError } from "./errors";

describe("Given a notFoundError midelware", () => {
  describe("When it is calles wit and next function, a responose and a request", () => {
    const req = {} as Partial<Request>;
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as Partial<Response>;
    test("The it should call the status method with 404 as status code", async () => {
      const statusCode = 404;
      await notFoundError(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("The it should call the json method with an error", async () => {
      const error = { error: "Endpoint Not Found" };

      await notFoundError(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a general error midelware", () => {
  const req = {} as Partial<Request>;
  const next = jest.fn();
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  describe("When it is called wit and next function, a responose a request and an error", () => {
    test("The it should call the status method with error status code", async () => {
      const error = {
        name: "error",
        message: "error",
        statusCode: 404,
        publicMessage: "error message",
      };

      await generalError(error, req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(error.statusCode);
    });
    test("Then it should call the json method with the error message", async () => {
      const error = {
        name: "error",
        message: "error",
        statusCode: 404,
        publicMessage: "error message",
      };

      await generalError(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: error.publicMessage });
    });
  });

  describe("When it is called wit and next function, a responose a request and an error without public error", () => {
    test("The it should call the status method with 'General fucked up' as error message ", async () => {
      const error = {
        name: "error",
        message: "error",
        statusCode: 404,
      };
      const defaultErrorMessage = "General fucked up";
      await generalError(error, req as Request, res as Response, next);

      expect(res.json).toHaveBeenCalledWith({ error: defaultErrorMessage });
    });
  });

  describe("When it receives a valition error", () => {
    const error = new ValidationError(
      { body: [{ message: "error" }] } as errors,
      {}
    );

    test("Then it should call the response status method with 400 status", () => {
      const expectedStatus = 400;

      generalError(
        error as unknown as CustomError,
        req as Request,
        res as Response,
        next
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatus);
    });

    test("Then it should call the response json method with the 'Invalid data' message", () => {
      const expectedError = {
        error: "Invalid data",
      };

      generalError(
        error as unknown as CustomError,
        req as Request,
        res as Response,
        next
      );

      expect(res.json).toHaveBeenCalledWith(expectedError);
    });
  });
});

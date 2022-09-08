import { NextFunction, Request, Response } from "express";
import { IReview } from "../types/review";
import createCustomError from "../utils/error";
import parseData from "./parseData";

describe("Given a parseData moddleware", () => {
  describe("When called with a request, a response and a next function as arguments", () => {
    const mockedReqBody: IReview = {
      brand: "nike",
      model: "jordan",
      review: "holahooalm",
      owner: "630e5e99bd6d5f91b999517b",
    };

    const reviewJson = JSON.stringify(mockedReqBody);
    const req = {
      body: { review: reviewJson },
      file: { filename: "jordan11" },
    } as Partial<Request>;

    const res = {} as Partial<Response>;

    const next = jest.fn() as NextFunction;

    test("Then it should asign the data as req body", async () => {
      await parseData(req as Request, res as Response, next);

      expect(req.body).toStrictEqual({
        ...mockedReqBody,
        picture: req.file.filename,
      });

      expect(next).toHaveBeenCalled();
    });

    test("Then it should asign the data as req body", async () => {
      const reqWithoutImage = {
        body: { review: reviewJson },
      } as Partial<Request>;

      const customError = createCustomError(
        404,
        "You must add",
        "Missing data"
      );
      await parseData(reqWithoutImage as Request, res as Response, next);

      expect(req.body).toStrictEqual({
        ...mockedReqBody,
        picture: req.file.filename,
      });

      expect(next).toHaveBeenCalledWith(customError);
    });
  });
});

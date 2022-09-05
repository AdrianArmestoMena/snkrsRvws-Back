import { NextFunction, Request, Response } from "express";
import { IReview } from "../types/review";
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
      file: { filename: "jordan11" } as any,
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
  });
});

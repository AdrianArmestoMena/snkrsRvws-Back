import { NextFunction, Request, Response } from "express";
import { Review } from "../../database/models/reviews";
import createCustomError from "../../utils/error";
import { createReview, getOwnerReviews } from "./reviewsController";

const next = jest.fn() as Partial<NextFunction>;

describe("Given a create review  controller", () => {
  const mockedReqBody = {
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

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  Review.create = jest.fn().mockReturnValue(mockedReqBody);

  const errorCustom = createCustomError(
    400,
    "Fail creating your reviews",
    "Could not add review"
  );

  describe("When it is called with a Request a Response and a Next fucntion", () => {
    test("Then it should call the status method of the response", async () => {
      await createReview(req as Request, res as Response, next as NextFunction);

      const statusCode = 201;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call the json method of the response", async () => {
      await createReview(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ newReview: mockedReqBody });
    });

    test("It should call the next function with the created error if it wasn't posible to create the user", async () => {
      Review.create = jest.fn().mockRejectedValue(new Error());

      await createReview(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(errorCustom);
    });
  });
});

describe("Given a get owner review  controller", () => {
  const req = {
    params: "" as unknown,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  const mockreviews = [
    {
      brand: "NIke",
      model: "Jordan 11 low black and white",
      picture: "uploads/f96fc1f1c03538f4940955da94925f90",
      review: "weqklrn ejq rtjqenr qejrt qer iluqe",
      owner: "6310d142612b1f0a1cec8961",
      id: "6315c901e752dbaefbdfca05",
    },
  ];

  Review.find = jest.fn().mockResolvedValue(mockreviews);

  describe("When it is called with a Request a Response and a Next fucntion", () => {
    test("Then it should call the status method of the response", async () => {
      await getOwnerReviews(
        req as Request,
        res as Response,
        next as NextFunction
      );

      const statusCode = 200;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call the json method of the response", async () => {
      await getOwnerReviews(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ reviews: mockreviews });
    });

    test("It should call the next function with the created error if it wasn't posible to create the user", async () => {
      Review.find = jest.fn().mockRejectedValue(new Error());

      const newError = createCustomError(
        404,
        "No reviews found",
        "Could not get reviews"
      );

      await getOwnerReviews(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});
import { NextFunction, Request, Response } from "express";
import { Review } from "../../database/models/reviews";
import createCustomError from "../../utils/error";
import { getbyBrand } from "./reviewsController";

const mockreviews = [
  {
    brand: "Nike",
    model: "Jordan 11 low black and white",
    picture: "uploads/f96fc1f1c03538f4940955da94925f90",
    review: "weqklrn ejq rtjqenr qejrt qer iluqe",
    owner: "6310d142612b1f0a1cec8961",
    id: "6315c901e752dbaefbdfca05",
  },
];

Review.find = jest.fn().mockResolvedValue(mockreviews);

const next = jest.fn() as Partial<NextFunction>;
beforeEach(() => jest.clearAllMocks());

describe("Given a get by brand controller", () => {
  const req = {
    params: { brand: "nike" } as unknown,
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as Partial<Response>;

  beforeEach(() => jest.clearAllMocks());

  describe("When it is called with a Request a Response and a Next fucntion", () => {
    test("Then it should call the status method of the response", async () => {
      await getbyBrand(req as Request, res as Response, next as NextFunction);

      const statusCode = 200;

      expect(res.status).toHaveBeenCalledWith(statusCode);
    });

    test("Then it should call the json method of the response", async () => {
      await getbyBrand(req as Request, res as Response, next as NextFunction);

      expect(res.json).toHaveBeenCalledWith({ reviews: mockreviews });
    });

    test("It should call the next function with the created error if it wasn't posible to create the user", async () => {
      Review.find = jest.fn().mockRejectedValue(new Error());

      const newError = createCustomError(
        404,
        "No reviews found",
        "Could not get reviews"
      );

      await getbyBrand(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(newError);
    });
  });
});

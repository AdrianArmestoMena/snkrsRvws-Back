import { NextFunction, Request, Response } from "express";
import fs from "fs/promises";
import createCustomError from "../utils/error";
import supabaseUpload from "./supabase";

const url = "jordan.com";
const req = {
  body: {
    picture: "jordan.jpg",
  },
} as Partial<Request>;
const res = {} as Partial<Response>;
const next = jest.fn() as NextFunction;

let mockUpload = jest.fn().mockReturnValue({
  error: null,
});

jest.mock("@supabase/supabase-js", () => ({
  createClient: () => ({
    storage: {
      from: () => ({
        upload: mockUpload,
        getPublicUrl: () => ({
          publicURL: url,
        }),
      }),
    },
  }),
}));

describe("Given a supabaseUpload function", () => {
  beforeEach(() => jest.clearAllMocks());
  beforeAll(async () => {
    await fs.writeFile(`uploads/${req.body.picture}`, "content");
  });

  afterAll(async () => {
    await fs.unlink(`uploads/${req.body.picture}`);
  });

  describe("When called with a request, a response and a next function as arguments", () => {
    test("Then it should call next", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });

    test("Then it should upload a file to supabase", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(mockUpload).toHaveBeenCalled();
    });

    test("Then it should set the image url at the body request", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(req.body.backupImage).toBe(url);
    });

    test("If an error occurs during the process, it should call next with an error", async () => {
      mockUpload = jest.fn().mockRejectedValue(new Error());

      const expectedError = createCustomError(
        404,
        "Couldn't upload or read the image",
        "Error while reading and uploading the image"
      );

      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(expectedError);

      const nextCalled = (next as jest.Mock<any, any>).mock.calls[0][0];
      expect(nextCalled.privateMessage).toBe(expectedError.privateMessage);
    });
  });
});

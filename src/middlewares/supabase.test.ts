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

  describe("When it is called with a request, a response and a next function", () => {
    test("Then it should call next function", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalled();
    });

    test("Then it should upload the file", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(mockUpload).toHaveBeenCalled();
    });

    test("If the upload fails, it should call next with an error", async () => {
      mockUpload = jest.fn().mockReturnValue({
        error: true,
      });

      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(true);
    });

    test("Then it should set the image url ass backup image at the body request", async () => {
      await supabaseUpload(
        req as Request,
        res as Response,
        next as NextFunction
      );

      expect(req.body.backupImage).toBe(url);
    });

    test("If teh upload reject as an error it should call next with the created error", async () => {
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

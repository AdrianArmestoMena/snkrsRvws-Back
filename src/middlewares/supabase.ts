import { NextFunction, Request, Response } from "express";
import { readFile } from "fs/promises";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import createCustomError from "../utils/error";

const supabase = createClient(
  "https://kurbelfjiuksksdyvdja.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cmJlbGZqaXVrc2tzZHl2ZGphIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI3NDAxMTQsImV4cCI6MTk3ODMxNjExNH0.HvUNFglF2m-nJ5wQPczN8_iVVgdLx9GlfDL5TPvUTI4"
);

const supabaseUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { picture } = req.body;

  const imagePath = path.join("uploads", picture);

  try {
    const fileData = await readFile(imagePath);

    const storage = supabase.storage.from("images");

    const uploadResult = await storage.upload(imagePath, fileData);

    if (uploadResult.error) {
      next(uploadResult.error);
      return;
    }

    const { publicURL } = storage.getPublicUrl(imagePath);

    req.body.backupImage = publicURL;
    next();
  } catch (error) {
    const newError = createCustomError(
      404,
      "Couldn't upload or read the image",
      "Error while reading and uploading the image"
    );
    next(newError);
  }
};

export default supabaseUpload;

import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDB from "../../database";
import app from "..";
import { User } from "../../database/models/users";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUrl = mongoServer.getUri();

  await connectDB(mongoUrl);
});

afterAll(async () => {
  await mongoose.connection.close();

  await mongoServer.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Given a /reviews/addeview route", () => {
  describe("When it is requested with a POST method and review data", () => {
    test("Then it should respond with a status of 201", async () => {
      const reviewMock = {
        brand: "nike",
        model: "jordan",
        review: "holahooalm",
        owner: "630e5e99bd6d5f91b999517b",
      };
      const reviewJson = JSON.stringify(reviewMock);
      const expectedStatus = 201;

      await request(app)
        .post("/reviews/addreview")
        .type("multipart/form-data")
        .field("review", reviewJson)
        .attach("picture", Buffer.from("image", "utf-8"), {
          filename: "jordna.jpg",
        })
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if some vakue is missing", async () => {
      const reviewMock = {
        brand: "nike",
        model: "jordan",
        owner: "630e5e99bd6d5f91b999517b",
      };
      const reviewJson = JSON.stringify(reviewMock);
      const expectedStatus = 400;

      await request(app)
        .post("/reviews/addreview")
        .type("multipart/form-data")
        .field("review", reviewJson)
        .attach("picture", Buffer.from("image", "utf-8"), {
          filename: "jordna.jpg",
        })
        .expect(expectedStatus);
    });
  });
});

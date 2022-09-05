import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { Response } from "express";
import connectDB from "../../database";
import app from "..";
import { Token } from "../../types/user";
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
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IjEyMzQ1NjciLCJpZCI6IjYzMTBkMTQyNjEyYjFmMGExY2VjODk2MSIsImlhdCI6MTY2MjM4NzIwOH0.5FBUtcB9yv6R2W-lFk9H14dmAOOecruuDAX6LVwPwiQ";
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
        .set("Authorization", `Bearer ${token}`)
        .type("multipart/form-data")
        .field("review", reviewJson)
        .attach("image", Buffer.from("image", "utf-8"), {
          filename: "jordna.jpg",
        })
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if some value is missing", async () => {
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

describe("Given a /reviews/:owner route", () => {
  describe("When it is requested with a POST method and review data", () => {
    test("Then it should respond with a status of 201", async () => {
      const userMock = {
        userName: "Adrianam",
        password: "Adrianama",
        email: "arm@armesto",
      };
      const mockUser = await User.create(userMock);
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IjEyMzQ1NjciLCJpZCI6IjYzMTBkMTQyNjEyYjFmMGExY2VjODk2MSIsImlhdCI6MTY2MjM4NzIwOH0.5FBUtcB9yv6R2W-lFk9H14dmAOOecruuDAX6LVwPwiQ";

      const expectedStatus = 200;

      await request(app)
        .get(`/reviews/${mockUser.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if the token is missing", async () => {
      const userMock = {
        userName: "Adrianam",
        password: "Adrianama",
        email: "arm@armesto",
      };
      const mockUser = await User.create(userMock);

      const expectedStatus = 400;

      await request(app).get(`/reviews/${mockUser.id}`).expect(expectedStatus);
    });
  });
});

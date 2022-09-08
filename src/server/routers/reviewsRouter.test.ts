import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import connectDB from "../../database";
import app from "..";
import { User } from "../../database/models/users";
import { Review } from "../../database/models/reviews";

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
  describe("When it is requested with a get method and the id of an owner as request param", () => {
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

describe("Given a /reviews/:idReview route", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IjEyMzQ1NjciLCJpZCI6IjYzMTBkMTQyNjEyYjFmMGExY2VjODk2MSIsImlhdCI6MTY2MjM4NzIwOH0.5FBUtcB9yv6R2W-lFk9H14dmAOOecruuDAX6LVwPwiQ";
  describe("When it is requested with a delete method and a id as param", () => {
    test("Then it should respond with a status of 201", async () => {
      const userReview = {
        brand: "NIke",
        model: "Jordan 11 low black and white",
        picture: "02a4502cd2a7de527d98a8c3e7871891",
        review: "dwjvniu jwdwg r3jgn3r g3r gj rtgkj4",
        owner: "6310d142612b1f0a1cec8961",
        id: "631624344805e6655b5b144a",
      };

      const mockReview = await Review.create(userReview);

      const expectedStatus = 201;

      await request(app)
        .delete(`/reviews/${mockReview.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if the id is incorrect", async () => {
      const reviewMock = {
        brand: "NIke",
        model: "Jordan 11 low black and white",
        picture: "02a4502cd2a7de527d98a8c3e7871891",
        review: "dwjvniu jwdwg r3jgn3r g3r gj rtgkj4",
        owner: "6310d142612b1f0a1cec8961",
        id: "631624344805e6655b5b144a",
      };
      const incorrectId = 1;
      await Review.create(reviewMock);
      const expectedStatus = 404;

      await request(app)
        .delete(`/reviews/${incorrectId}}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);
    });
  });
});

describe("Given a /reviews/onereview/:idReview route", () => {
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6IjEyMzQ1NjciLCJpZCI6IjYzMTBkMTQyNjEyYjFmMGExY2VjODk2MSIsImlhdCI6MTY2MjM4NzIwOH0.5FBUtcB9yv6R2W-lFk9H14dmAOOecruuDAX6LVwPwiQ";
  describe("When it is requested with a get method and a id as param", () => {
    test("Then it should respond with a status of 201", async () => {
      const userReview = {
        brand: "NIke",
        model: "Jordan 11 low black and white",
        picture: "02a4502cd2a7de527d98a8c3e7871891",
        review: "dwjvniu jwdwg r3jgn3r g3r gj rtgkj4",
        owner: "6310d142612b1f0a1cec8961",
        id: "631624344805e6655b5b144a",
      };

      const mockReview = await Review.create(userReview);

      const expectedStatus = 200;

      await request(app)
        .get(`/reviews/onereview/${mockReview.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if the id is incorrect", async () => {
      const reviewMock = {
        brand: "NIke",
        model: "Jordan 11 low black and white",
        picture: "02a4502cd2a7de527d98a8c3e7871891",
        review: "dwjvniu jwdwg r3jgn3r g3r gj rtgkj4",
        owner: "6310d142612b1f0a1cec8961",
        id: "631624344805e6655b5b144a",
      };
      const incorrectId = 1;
      await Review.create(reviewMock);
      const expectedStatus = 404;

      await request(app)
        .get(`/reviews/onereview/${incorrectId}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(expectedStatus);
    });
  });
});

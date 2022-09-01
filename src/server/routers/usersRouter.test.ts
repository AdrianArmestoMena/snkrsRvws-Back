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

describe("Given a /users/signup route", () => {
  describe("When it is requested with a POST method and a user name, an email, and a password", () => {
    test("Then it should respond with a status of 201", async () => {
      const userMock = {
        userName: "Adrianam",
        password: "Adrianama",
        email: "arm@armesto",
      };

      const expectedStatus = 201;

      await request(app)
        .post("/users/signup")
        .send(userMock)
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if the password is invalid", async () => {
      const userMock = {
        userName: "Adrianam",
        password: "",
        email: "arm@armesto",
      };

      const expectedStatus = 400;

      await request(app)
        .post("/users/signup")
        .send(userMock)
        .expect(expectedStatus);
    });
  });
});

describe("Given a /users/login route", () => {
  describe("When it is requested with a POST method and a user name and a password", () => {
    test("Then it should respond with a status of 200", async () => {
      const userMock = {
        userName: "Adrianam",
        password: "Adrianama",
        email: "arm@armesto",
      };

      await request(app).post("/users/signup").send(userMock);

      const userMockLogin = {
        userName: "Adrianam",
        password: "Adrianama",
      };

      const expectedStatus = 200;

      await request(app)
        .post("/users/login")
        .send(userMockLogin)
        .expect(expectedStatus);
    });

    test("Then it should respond with a status of 400 if the password is invalid", async () => {
      const userMock = {
        userName: "Adrianam",
        password: "Adrianama",
        email: "arm@armesto",
      };

      await request(app).post("/users/signup").send(userMock);

      const userMockLogin = {
        userName: "Adrianam",
        password: "Antoniooo",
      };

      const expectedStatus = 400;

      await request(app)
        .post("/users/login")
        .send(userMockLogin)
        .expect(expectedStatus);
    });
  });
});

import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";

describe("User Routes", () => {
  app;

  beforeAll(() => {
    app;
  });

  // afterAll(async () => {
  //   await prisma.task.deleteMany();
  //   await prisma.project.deleteMany();
  //   await prisma.user.deleteMany();
  // });

  describe("validation", () => {
    test("Valid Email user", async () => {
      const result = await request(app)
        .post("/user")
        .send({ email: "invalid@@global.com" })
        .expect(404);
      expect(result.body.message).toBe("Endereço de e-mail invalido!");
    });

    test("Valid user or email exist in database", async () => {
      await prisma.user.create({
        data: {
          name: "Usuário de teste",
          department: "contábil",
          email: "testeUSER@global.com",
          registration: "12345",
          dateCreated: "2023-11-05T20:47:00.000Z",
        },
      });
      const result = await request(app)
        .post("/user")
        .send({ email: "teste@global.com" })
        .expect(404);
      expect(result.body.message).toBe(
        "Os dados informados já constam em nossos registros!"
      );
    });

    test("Valid routes and created User", async () => {
      const result = await request(app)
        .post("/user")
        .send({
          name: "Usuario de teste 1",
          department: "contábil1",
          email: "testeUSER1@global.com",
          registration: "123456",
        })
        .expect(200);
      expect(result.body.message).toBe("Usuário cadastrado com sucesso!");
    });

    test("Valid connection with database", async () => {
      jest.spyOn(prisma.user, "create").mockImplementationOnce(() => {
        throw new Error();
      });

      const result = await request(app)
        .post("/user")
        .send({
          name: "Usuario de teste 2",
          department: "contábil2",
          email: "testeUSERS2@global.com",
          registration: "1234567",
        })
        .expect(500);
      expect(result.body.message).toBe(
        "Falha ao criar usuário, tente novamente mais tarde!"
      );
    });
  });
});

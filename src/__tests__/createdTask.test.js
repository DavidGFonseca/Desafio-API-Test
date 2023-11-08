import request from "supertest";
import app from "../app";
import { prisma } from "../config/database";

describe("Test created task", () => {
  app;

  beforeAll(async () => {
    app;
    await prisma.user.create({
      data: {
        id: "1234",
        name: "David teste 123",
        department: "Contabil",
        email: "teste@global.com",
        registration: "12",
        dateCreated: "2023-11-05T21:36:00.000Z",
      },
    });

    await prisma.project.create({
      data: {
        id: "12a45b78c96q357q",
        name: "Project test 1",
        dateCreated: "2023-11-05T20:47:00.000Z",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-12-05T23:59:59.000Z",
        userId: "1234",
      },
    });

    await prisma.task.create({
      data: {
        description: "Tarefa de test 1",
        priority: "Urgent",
        dateCreated: "2023-11-05T20:47:00.000Z",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-12-05T21:59:59.000Z",
        projId: "12a45b78c96q357q",
        userId: "1234",
      },
    });
  });
  // afterAll(async () => {
  //   await prisma.task.deleteMany();
  //   await prisma.project.deleteMany();
  //   await prisma.user.deleteMany();
  // });

  test("Validating if all fields are filled", async () => {
    const result = await request(app)
      .post("/task")
      .send({
        projId: "12a45b78c96q357q",
        userId: "1234",
        dateEnd: "2023-12-05T21:59:59.000Z",
      })
      .expect(404);
    expect(result.body.message).toBe(
      "Por favor informar todos os campos corretamente!"
    );
  });

  test("Validating, if task included valid project", async () => {
    const result = await request(app)
      .post("/task")
      .send({
        description: "Tarefa de test 2",
        priority: "Urgent",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-12-05T21:59:59.000Z",
        projId: "12a45b78c96q357q1",
        userId: "1234",
      })
      .expect(404);
    expect(result.body.message).toBe("Projeto não existente!");
  });

  test("Validating, if task already exists in the project", async () => {
    const result = await request(app)
      .post("/task")
      .send({
        description: "Tarefa de test 1",
        priority: "Urgent",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-12-05T21:59:59.000Z",
        projId: "12a45b78c96q357q",
        userId: "1234",
      })
      .expect(404);
    expect(result.body.message).toBe("Tarefa já existente neste projeto!");
  });

  test("validating, if the completion date is less than the start date the task", async () => {
    const result = await request(app)
      .post("/task")
      .send({
        description: "Tarefa de test 3",
        priority: "Urgent",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-10-05T23:59:59.000Z",
        projId: "12a45b78c96q357q",
        userId: "1234",
      })
      .expect(404);
    expect(result.body.message).toBe(
      "A data de conclusão da tarefa deve ser maior que a data inicial da tarefa!"
    );
  });

  test("validating, if the completion date is greater than the project end date", async () => {
    const result = await request(app)
      .post("/task")
      .send({
        description: "Tarefa de test 4",
        priority: "Urgent",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-12-07T23:59:59.000Z",
        projId: "12a45b78c96q357q",
        userId: "1234",
      })
      .expect(404);
    expect(result.body.message).toBe(
      "A data de conclusão da tarefa deve ser menor que a data final do projeto!"
    );
  });

  test("validation, created the task with sucess!", async () => {
    const result = await request(app)
      .post("/task")
      .send({
        description: "Tarefa de test 5",
        priority: "Urgent",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-11-06T23:59:59.000Z",
        projId: "12a45b78c96q357q",
        userId: "1234",
      })
      .expect(200);
    expect(result.body.message).toBe("Tarefa criada com sucesso!");
  });

  test("Validation, connect", async () => {
    jest.spyOn(prisma.task, "create").mockImplementationOnce(() => {
      throw new Error();
    });
    const result = await request(app)
      .post("/task")
      .send({
        description: "Tarefa de test 6",
        priority: "Urgent",
        dateStart: "2023-11-05T20:47:00.000Z",
        dateEnd: "2023-11-07T23:59:59.000Z",
        projId: "12a45b78c96q357q",
        userId: "1234",
      })
      .expect(500);
    expect(result.body.message).toBe(
      "Falha ao criar tarefa, tente novamente mais tarde!"
    );
  });
});

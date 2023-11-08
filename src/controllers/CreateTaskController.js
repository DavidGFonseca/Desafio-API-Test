import { prisma } from "../config/database";

export class CreateTaskController {
  async handle(request, response) {
    try {
      const { description, priority, dateStart, dateEnd, userId, projId } =
        request.body;

      if (
        !description ||
        !priority ||
        !dateStart ||
        !dateEnd ||
        !userId ||
        !projId
      ) {
        return response.status(404).json({
          message: "Por favor informar todos os campos corretamente!",
        });
      }

      const projExist = await prisma.project.findFirst({
        where: { id: projId },
      });

      if (!projExist) {
        return response.status(404).json({ message: "Projeto não existente!" });
      }

      const taskDuplic = await prisma.task.findFirst({
        where: {
          AND: [{ description }, { projId }],
        },
      });

      if (taskDuplic) {
        return response
          .status(404)
          .json({ message: "Tarefa já existente neste projeto!" });
      }

      const project = await prisma.project.findFirst({
        where: {
          id: projId,
        },
      });

      const dateEndProject = project.dateEnd;

      if (dateEnd < dateStart) {
        return response.status(404).json({
          message:
            "A data de conclusão da tarefa deve ser maior que a data inicial da tarefa!",
        });
      }

      if (Date.parse(dateEnd) > Date.parse(dateEndProject)) {
        return response.status(404).json({
          message:
            "A data de conclusão da tarefa deve ser menor que a data final do projeto!",
        });
      }

      const date = new Date();
      const dateLocal = date.toISOString();

      await prisma.task.create({
        data: {
          description,
          priority,
          dateCreated: dateLocal,
          dateStart,
          dateEnd,
          userId,
          projId,
        },
      });
      return response
        .status(200)
        .json({ message: "Tarefa criada com sucesso!" });
    } catch (error) {
      return response.status(500).json({
        message: "Falha ao criar tarefa, tente novamente mais tarde!",
      });
    }
  }
}

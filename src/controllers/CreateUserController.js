import { prisma } from "../config/database";

export class CreateUserController {
  async handle(request, response) {
    try {
      const { name, department, email, registration } = request.body;
      const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regexEmail.test(email)) {
        return response
          .status(404)
          .json({ message: "Endereço de e-mail invalido!" });
      }
      const ExistUser = await prisma.user.findFirst({
        where: { registration },
      });
      const ExistEmail = await prisma.user.findFirst({ where: { email } });
      if (ExistUser || ExistEmail) {
        return response.status(404).json({
          message: "Os dados informados já constam em nossos registros!",
        });
      }
      const date = new Date();
      const dateLocal = date.toISOString();

      await prisma.user.create({
        data: {
          name,
          department,
          email,
          registration,
          dateCreated: dateLocal,
        },
      });
      return response
        .status(200)
        .json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
      return response.status(500).json({
        message: "Falha ao criar usuário, tente novamente mais tarde!",
      });
    }
  }
}

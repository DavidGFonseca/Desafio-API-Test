import { Router } from "express";
import { CreateUserController } from "../controllers/CreateUserController.js";
import { CreateTaskController } from "../controllers/CreateTaskController.js";

const router = Router();
const createUser = new CreateUserController();
const createTask = new CreateTaskController();

router.post("/user", createUser.handle);
router.post("/task", createTask.handle);

export { router };

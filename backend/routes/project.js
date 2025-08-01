import express from "express";
import authMiddleware from "../middleware/auth-middleware.js";
import { validateRequest } from "zod-express-middleware";
import { projectSchema } from "../libs/validate-schema.js";
import { z } from "zod";
import {
  createProject,
  getProjectDetails,
  getProjectTasks,
  updateProject,
  deleteProject,
} from "../controllers/project.js";

const router = express.Router();

router.post(
  "/:workspaceId/create-project",
  authMiddleware,
  validateRequest({
    params: z.object({
      workspaceId: z.string(),
    }),
    body: projectSchema,
  }),
  createProject
);

router.get(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  getProjectDetails
);

router.get(
  "/:projectId/tasks",
  authMiddleware,
  validateRequest({ params: z.object({ projectId: z.string() }) }),
  getProjectTasks
);

router.put(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
    body: projectSchema.partial(), // Allow partial updates
  }),
  updateProject
);

router.delete(
  "/:projectId",
  authMiddleware,
  validateRequest({
    params: z.object({ projectId: z.string() }),
  }),
  deleteProject
);

export default router;
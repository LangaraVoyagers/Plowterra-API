import authenticationController from "../controllers/authentication.controllers";
import express from "express";

const authenticationRouter = express.Router();

// POST: /api/v1/auth/signin
authenticationRouter.post("/auth/signin", authenticationController.signIn);

// POST: /api/v1/auth/signup
authenticationRouter.post("/auth/signup", authenticationController.signUp);

// GET: /api/v1/auth/refresh
authenticationRouter.post("/auth/refresh", authenticationController.refreshToken);

export default authenticationRouter;

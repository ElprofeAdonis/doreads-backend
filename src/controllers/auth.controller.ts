import { Request, Response } from "express";
import {
  LoginSchema,
  RegisterUserSchema,
  RefreshTokenSchema,
  ProfileSchema,
} from "../models/auth.models";
import authService from "../services/auth.service";
import { BaseController } from "../types/base.controller";

class AuthController extends BaseController {
  async register(req: Request, res: Response) {
    try {
      const data = await RegisterUserSchema.validateAsync(req.body);
      const result = await authService.register(data);
      this.responseHandler(
        res,
        { message: `User ${result.name} created successfully` },
        200
      );
    } catch (error: any) {
      if (error.code && error.code === "P2002") {
        this.responseHandler(res, { error: "User was already register" }, 400);
      } else {
        this.errorHandler(res, error);
      }
    }
  }

  async login(req: Request, res: Response) {
    try {
      const data = await LoginSchema.validateAsync(req.body);
      const result = await authService.login(data.email, data.password);
      this.responseHandler(res, result, 200);
    } catch (error: any) {
      console.log(
        "◉ ▶ file: auth.controller.ts:32 ▶ AuthController ▶ login ▶ error:",
        error
      );
      this.errorHandler(res, error);
    }
  }

  async resfreshToken(req: Request, res: Response) {
    try {
      const data = await RefreshTokenSchema.validateAsync(req.body);
      const result = await authService.refreshToken(data.refreshToken);
      this.responseHandler(res, result, 200);
    } catch (error: any) {
      this.errorHandler(res, error);
    }
  }
  async profile(req: Request, res: Response) {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      const data = await ProfileSchema.validateAsync({ Token: token });
      const result = await authService.profile(data.Token);
      this.responseHandler(res, result, 200);
    } catch (error: any) {
      this.errorHandler(res, error);
    }
  }
    
}

export default new AuthController();

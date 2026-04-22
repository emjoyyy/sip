import { Request, Response } from "express";
import { toPublicUser, userService } from "../service/userService";

export const loginUser = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email ?? "").trim();
    const password = String(req.body.password ?? "");

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" });
    }

    const user = await userService.validateCredentials(email, password);
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    return res.json(toPublicUser(user));
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ error: "Login failed" });
  }
};

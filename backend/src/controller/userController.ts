import { Request, Response } from "express";
import { toPublicUser, userService } from "../service/userService";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const email = String(req.body.email ?? "").trim();
    const password = String(req.body.password ?? "");
    const firstName = String(req.body.first_name ?? "").trim();
    const lastName = String(req.body.last_name ?? "").trim();
    const role = String(req.body.role ?? "").trim();

    if (!email || !password || !firstName || !lastName || !role) {
      return res.status(400).json({
        error:
          "Missing required fields: email, password, first_name, last_name, role",
      });
    }

    const existing = await userService.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await userService.create({
      email,
      password,
      firstName,
      lastName,
      role,
    });

    return res.status(201).json(toPublicUser(user));
  } catch (err) {
    console.error("REGISTER ERROR:", err);
    return res.status(500).json({ error: "Registration failed" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ error: "Invalid user id" });
    }

    const result = await userService.deleteById(userId);
    if (!result.ok) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({ message: "User deleted" });
  } catch (err) {
    console.error("DELETE USER ERROR:", err);
    return res.status(500).json({ error: "Error deleting user" });
  }
};

import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const {
      email,
      password,
      first_name,
      last_name,
      role,
      username
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOneBy({ email });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = userRepo.create({
      email,
      password,
      firstName: first_name,   // 🔥 FIX
      lastName: last_name,     // 🔥 FIX
      role,
    });

    await userRepo.save(user);

    res.json(user);

  } catch (err) {
    console.log("REGISTER ERROR:", err); // 🔥 ще виждаме реалната грешка
    res.status(500).json(err);
  }
};
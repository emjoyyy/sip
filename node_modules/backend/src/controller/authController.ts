import { Request, Response } from "express";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";

// REGISTER
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    const userRepo = AppDataSource.getRepository(User);

    const existing = await userRepo.findOneBy({ email });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = userRepo.create({
      email,
      password,
      firstName: first_name,
      lastName: last_name,
      role,
    });

    await userRepo.save(user);

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Register error");
  }
};

// LOGIN
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOneBy({ email });

    if (!user || user.password !== password) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send("Login error");
  }
};
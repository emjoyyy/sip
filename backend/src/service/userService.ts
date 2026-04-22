import bcrypt from "bcrypt";
import { Repository } from "typeorm";
import { User } from "../entities/User";
import { UserRepository } from "../repository/userRepository";
import { applicationService } from "./applicationService";
import { jobService } from "./jobService";

const BCRYPT_ROUNDS = 10;

/** Input for creating a row — matches public fields on `User` (no `id`). */
export type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
};

/** Safe shape for JSON responses (no password hash). */
export type PublicUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export function toPublicUser(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  };
}

/**
 * User domain/service layer: persistence + future rules (unique email, hashing, etc.).
 * Keep Express out of here; controllers map HTTP ↔ these methods.
 */
export class UserService {
  constructor(private readonly users: Repository<User> = UserRepository) {}

  async create(input: CreateUserInput): Promise<User> {
    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const entity = this.users.create({
      email: input.email,
      password: passwordHash,
      firstName: input.firstName,
      lastName: input.lastName,
      role: input.role,
    });
    return this.users.save(entity);
  }

  /** Returns the user when email + password match; otherwise `null`. */
  async validateCredentials(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(password, user.password);
    return match ? user : null;
  }

  async findById(id: number): Promise<User | null> {
    return this.users.findOneBy({ id });
  }

  /** User must exist and have role `company` (for job posting, etc.). */
  async findCompanyById(id: number): Promise<User | null> {
    const user = await this.findById(id);
    if (!user || user.role !== "company") return null;
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.findOneBy({ email });
  }

  async findAll(): Promise<User[]> {
    return this.users.find();
  }

  /**
   * Deletes a user and dependent rows: applications as student, then (if company)
   * all posted jobs and their applications, then the user row.
   */
  async deleteById(
    id: number
  ): Promise<{ ok: true } | { ok: false; reason: "not_found" }> {
    const user = await this.findById(id);
    if (!user) return { ok: false, reason: "not_found" };

    await applicationService.deleteAllForStudent(id);

    if (user.role === "company") {
      await jobService.deleteAllJobsForCompany(id);
    }

    await this.users.remove(user);
    return { ok: true };
  }
}

/** Wired to app `UserRepository` — import this from controllers. */
export const userService = new UserService();

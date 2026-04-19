import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

export async function login(req: Request, res: Response) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
}

// One-time setup route — protected by a setup secret, not for public use
export async function register(req: Request, res: Response) {
  const secret = req.headers["x-setup-secret"];
  if (secret !== process.env.SETUP_SECRET) {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const existing = await prisma.user.findFirst();
  if (existing) {
    res.status(409).json({ error: "Account already exists" });
    return;
  }

  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  const { email, name, password } = parsed.data;
  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { email, name, password: hashed },
  });

  res.status(201).json({ id: user.id, email: user.email, name: user.name });
}

export async function me(req: Request & { userId?: string }, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(user);
}

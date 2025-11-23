import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { RegisterDto, LoginDto } from "./dto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new UnauthorizedException("Email already registered");
    }
    const password = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { email: dto.email, password, name: dto.name ?? undefined } });
    return { id: user.id, email: user.email, name: user.name };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException("Invalid credentials");

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || "dev-secret", {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d"
    });
    return { token };
  }

  async me(token?: string) {
    if (!token) throw new UnauthorizedException();
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET || "dev-secret") as { id: string; email: string };
      const user = await this.prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) throw new UnauthorizedException();
      return { id: user.id, email: user.email, name: user.name };
    } catch {
      throw new UnauthorizedException();
    }
  }
}

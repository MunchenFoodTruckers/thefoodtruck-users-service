import { Body, Controller, Get, Headers, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { RegisterDto, LoginDto } from "./dto";

@Controller()
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get("/api/users/health")
  health() {
    return { ok: true };
  }

  @Post("/api/users/register")
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Post("/api/users/login")
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }

  @Get("/api/users/me")
  me(@Headers("authorization") auth?: string) {
    const token = auth?.replace("Bearer ", "");
    return this.service.me(token);
  }
}

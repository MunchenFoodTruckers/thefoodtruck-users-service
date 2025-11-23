export class RegisterDto {
  email!: string;
  password!: string;
  name?: string | null;
}

export class LoginDto {
  email!: string;
  password!: string;
}

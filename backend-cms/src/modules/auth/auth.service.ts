import { Injectable, Inject, ConflictException, UnauthorizedException } from '@nestjs/common';
import { DRIZZLE } from '../../db/drizzle.provider';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from '../../db/schema';
import { eq } from 'drizzle-orm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(DRIZZLE)
    private db: PostgresJsDatabase<typeof schema>,
    private jwtService: JwtService,
  ) {}

  async registerUser(dto: RegisterDto) {
    const { email, password, fullName } = dto;

    const existingUser = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (existingUser) {
      throw new ConflictException('A user with this email is already registered!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [newUser] = await this.db
      .insert(schema.users)
      .values({
        email,
        password: hashedPassword,
        fullName,
        role: 'CUSTOMER',
      })
      .returning({
        id: schema.users.id,
        email: schema.users.email,
        fullName: schema.users.fullName,
        role: schema.users.role,
        createdAt: schema.users.createdAt,
      });

    return {
      message: 'User registered successfully!',
      user: newUser,
    };
  }

  async loginUser(dto: LoginDto) {
    const { email, password } = dto;

    const user = await this.db.query.users.findFirst({
      where: eq(schema.users.email, email),
    });

    if (!user) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password!');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      message: 'Login successful!',
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
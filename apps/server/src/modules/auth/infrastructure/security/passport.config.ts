import { IAuthRepository } from "@/modules/auth/domain/repositories/auth-repository.interface";
import { AUTH_TYPES } from "@/modules/auth/auth.token";
import { Container } from "inversify";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { envConfig } from "@/config/env.config";
import { IPasswordHasher } from "@/shared/security/password-hasher.interface";
import { AuthenticatedUser } from "@/shared/security/authenticated-user.interface";

function toAuthenticatedUser(user: {
  id: string;
  name: string;
  email: string;
  role: AuthenticatedUser["role"];
  isDeleted: boolean;
}): AuthenticatedUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    isDeleted: user.isDeleted,
  };
}

export function configurePassport(container: Container): void {
  const authRepository = container.get<IAuthRepository>(AUTH_TYPES.Repository);
  const passwordHasher = container.get<IPasswordHasher>(
    AUTH_TYPES.PasswordHasher,
  );

  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password", session: false },
      async (email, password, done) => {
        try {
          const user = await authRepository.findByEmail(email);
          if (!user || user.isDeleted) {
            return done(null, false);
          }

          const isValidPassword = await passwordHasher.compare(
            password,
            user.password,
          );

          if (!isValidPassword) {
            return done(null, false);
          }

          return done(null, toAuthenticatedUser(user));
        } catch (error) {
          return done(error as Error);
        }
      },
    ),
  );

  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: envConfig.jwtSecret,
      },
      async (payload, done) => {
        try {
          if (payload.type !== "access") {
            return done(null, false);
          }
          const user = await authRepository.findById(payload.sub);
          if (!user || user.isDeleted) {
            return done(null, false);
          }

          return done(null, toAuthenticatedUser(user));
        } catch (error) {
          return done(error as Error, false);
        }
      },
    ),
  );
}

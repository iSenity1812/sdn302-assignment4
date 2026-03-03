export const AUTH_TYPES = {
  Repository: Symbol.for("Auth.Repository"),
  TokenService: Symbol.for("Auth.TokenService"),
  PasswordHasher: Symbol.for("Auth.PasswordHasher"),
  Controller: Symbol.for("Auth.Controller"),
  UseCase: {
    Login: Symbol.for("Auth.UseCase.Login"),
    Logout: Symbol.for("Auth.UseCase.Logout"),
    Refresh: Symbol.for("Auth.UseCase.Refresh"),
    ChangePassword: Symbol.for("Auth.UseCase.ChangePassword"),
    ForgotPassword: Symbol.for("Auth.UseCase.ForgotPassword"),
    ResetPassword: Symbol.for("Auth.UseCase.ResetPassword"),
  },
};

export const USER_TYPES = {
  Service: Symbol.for("User.Service"),
  Repository: Symbol.for("User.Repository"),
  Controller: Symbol.for("User.Controller"),
  UseCase: {
    RegisterUser: Symbol.for("User.UseCase.RegisterUser"),
    GetUser: Symbol.for("User.UseCase.GetUser"),
    UpdateUser: Symbol.for("User.UseCase.UpdateUser"),
    DeleteUser: Symbol.for("User.UseCase.DeleteUser"),
  },
};

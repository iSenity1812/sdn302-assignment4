export const LOGGER_TYPES = {
  /**
   * This is the type identifier for the application logger. You can bind your logger implementation to this type in the infrastructure module.
   * For example, if you are using a custom logger class called `AppLogger`, you would bind it like this:
   * container.bind(LOGGER_TYPES.AppLogger).to(AppLogger);
   *
   * Then, you can inject the logger into your services or controllers using the same type identifier:
   * @inject(LOGGER_TYPES.AppLogger) private readonly logger: AppLogger
   */
  AppLogger: Symbol.for("Logger.AppLogger"),
};

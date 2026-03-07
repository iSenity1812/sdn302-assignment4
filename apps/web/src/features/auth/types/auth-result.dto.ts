export type AuthFlagResultDto = {
  changed?: boolean;
  loggedOut?: boolean;
  reset?: boolean;
};

export type AuthForgotPasswordResultDto = {
  message: string;
  resetToken?: string;
};

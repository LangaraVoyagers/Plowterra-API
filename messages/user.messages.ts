const userMessage = {
  USER_CREATE_SUCCESS:"Account created successfully",
  USER_CREATE_ERROR: "Account not created try again later",
  USER_CREATE_ACCOUNT_EXISTS: "Account already exists, please try to login",
  USER_CREATE_FARM_ID_ERROR: "Invalid farm ID, please contact admin",
  USER_LOGIN_SUCCESS: "Logged in successfully",
  USER_LOGIN_ERROR: "Login unsuccessful, please try again later",
  USER_ALREADY_LOGGED_IN: "User is already logged in, please try again after few minutes",
  USER_LOGIN_DISABLED: "Account has been disabled, please contact admin",
  USER_EMAIL_PASSWORD_MISS_MATCH: "Your password is incorrect or account doesn't exists",
  USER_JWT_VERIFIED: "Valid token",
  USER_JWT_REFRESH_SUCCESS: "Refreshed successfully",
  USER_JWT_REFRESH_ERROR: "Refresh unsuccessful, please try again later",
  USER_JWT_EXPIRED: "Authorization token expired",
  USER_JWT_INVALID: "Invalid Authorization token passed",
  USER_AUTH_ERROR: "Authorization error, please try again later"
};

export default userMessage;

// src/auth.js

import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: process.env.AWS_COGNITO_POOL_ID,
    userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID,
    oauth: {
      domain: process.env.AWS_COGNITO_HOSTED_UI_DOMAIN,
      scope: ["email", "profile", "openid"],
      redirectSignIn: process.env.OAUTH_SIGN_IN_REDIRECT_URL,
      redirectSignOut: process.env.OAUTH_SIGN_OUT_REDIRECT_URL,
      responseType: "code",
    },
  },
});

async function getUser() {
  try {
    const currentAuthenticatedUser = await Auth.currentAuthenticatedUser();
    console.log("user authenticated successfully");
    const username = currentAuthenticatedUser.username;
    const idToken = currentAuthenticatedUser.signInUserSession.idToken.jwtToken;
    const accessToken =
      currentAuthenticatedUser.signInUserSession.accessToken.jwtToken;

    return {
      username,
      idToken,
      accessToken,
      authorizationHeaders: (type = "application/json") => {
        const headers = { "Content-Type": type };
        headers["Authorization"] = `Bearer ${idToken}`;
        return headers;
      },
    };
  } catch (err) {
    console.log(err);
    return null;
  }
}

export { Auth, getUser };
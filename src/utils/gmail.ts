import { google } from "googleapis";
// connecting to the gmail api via googleapis
export async function getGmailService(access_token: string, refresh_token: string) {
  // passing access token so that auth can use it to verify the user in order to gain access to their inbox
  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    // the redirect url from the google cloud console
    // *** in the authorized redirects uri in *CREDENTIALS*
    redirectUri: "http://localhost:3000/api/auth/callback/google",
  });
  auth.setCredentials({ access_token, refresh_token });
  // returns google.gmail so that it can be instantiated
  return google.gmail({ version: "v1", auth });
}

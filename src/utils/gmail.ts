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
  // Refresh token if expired
  // Check if the token is expired or about to expire
  const credentials = auth.credentials;
  if (credentials.expiry_date) {
    const now = Date.now();
    const buffer = 5 * 60 * 1000; // 5 minutes buffer time
    if (credentials.expiry_date <= now + buffer) {
      // Token is expired or about to expire, refresh it
      try {
        const { credentials: newCredentials } = await auth.refreshAccessToken();
        auth.setCredentials(newCredentials);
      } catch (error) {
        console.error("Error refreshing access token:", error);
        throw new Error("Failed to refresh access token");
      }
    }
  }
  auth.setCredentials({ access_token, refresh_token });
  // returns google.gmail so that it can be instantiated
  return google.gmail({ version: "v1", auth });
}

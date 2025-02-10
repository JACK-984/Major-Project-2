import { auth } from "@/lib/auth";
import { getGmailService } from "@/utils/gmail";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const pageToken = searchParams.get("pageToken") || undefined;

  const session = await auth();
  const access_token = session?.accessToken;
  const refresh_token = session?.refreshToken;

  if (session === null) return new NextResponse("Unauthorized", { status: 401 });
  else if (access_token === null) return new NextResponse("No access token", { status: 401 });
  else if (refresh_token === null) return new NextResponse("No refresh token", { status: 401 });

  const gmail = getGmailService(access_token as string, refresh_token as string);

  // Fetch the list of messages
  const response = await (
    await gmail
  ).users.messages.list({
    userId: "me",
    maxResults: 5, // Number of messages per page
    pageToken, // Use the pageToken for pagination
  });

  // Get full message details for each message
  const messages = await Promise.all(
    response.data.messages?.map(async (message) => {
      const fullMessage = await (
        await gmail
      ).users.messages.get({
        userId: "me",
        id: message.id as string,
        format: "full", // Use "full" to get the complete message body
      });

      // Extract headers
      const headers = fullMessage.data.payload?.headers || [];
      const subject =
        headers.find((header) => header.name?.toLowerCase() === "subject")?.value || "No Subject";
      const from =
        headers.find((header) => header.name?.toLowerCase() === "from")?.value || "Unknown Sender";
      const date = headers.find((header) => header.name?.toLowerCase() === "date")?.value || "";

      // Extract the email address from the "From" header
      const email = from.match(/<([^>]+)>/)?.[1] || from;

      // Extract the sender's name from the "From" header
      // Extract and clean the sender's name from the "From" header
      const name = cleanName(from.replace(/<[^>]+>/, "").trim());

      // Extract the message body (plain text or HTML)
      const text = extractMessageBody(fullMessage.data.payload);

      // Determine if the message is read
      const read = !fullMessage.data.labelIds?.includes("UNREAD");

      // Extract labels (if available)
      const labels = fullMessage.data.labelIds || [];

      return {
        id: message.id,
        name,
        email,
        subject,
        text,
        date,
        read,
        labels,
      };
    }) || []
  );

  return new NextResponse(
    JSON.stringify({
      messages,
      nextPageToken: response.data.nextPageToken, // Pass the nextPageToken to the frontend
    }),
    { status: 200 }
  );
}

// Helper function to extract the message body
function extractMessageBody(payload: any): string {
  if (!payload) return "";

  // Helper function to decode base64 content
  const decodeBody = (data: string) => {
    return Buffer.from(data, "base64").toString("utf-8");
  };

  let htmlBody = "";
  let plainTextBody = "";

  // Function to recursively search for message parts
  const findBodies = (part: any) => {
    // If this part has a body, check its type and store it
    if (part.mimeType === "text/html" && part.body?.data) {
      htmlBody = decodeBody(part.body.data);
    } else if (part.mimeType === "text/plain" && part.body?.data) {
      plainTextBody = decodeBody(part.body.data);
    }

    // If this part has sub-parts, search through them
    if (part.parts) {
      part.parts.forEach(findBodies);
    }
  };

  // Start the search with the initial payload
  findBodies(payload);

  // Return HTML content if available, otherwise return plain text
  return htmlBody || plainTextBody || "";
}
// Helper function to clean name strings
function cleanName(name: string): string {
  return name
    .replace(/^["']|["']$/g, "") // Remove quotes at start and end
    .replace(/\\"/g, '"') // Replace escaped quotes with regular quotes
    .trim(); // Remove any extra whitespace
}

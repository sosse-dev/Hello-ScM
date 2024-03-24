import { getServerSession } from "next-auth";
import { authOption } from "../api/auth/[...nextauth]/route";

export default async function getSession() {
  const session = await getServerSession(authOption);

  if (!session) {
    return null;
  }

  return session;
}

import { getServerSession } from "next-auth";
import { authOption } from "@/lib/authOption";

export default async function getSession() {
  const session = await getServerSession(authOption);

  if (!session) {
    return null;
  }

  return session;
}

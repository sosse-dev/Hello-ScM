import { signOut } from "next-auth/react";

export const handleDeleteUser = async (email: string) => {
  try {
    signOut({ callbackUrl: "/login" });
    await fetch(`/api/userdata/${email}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: null,
    });
  } catch (e) {
    return null;
  }
};

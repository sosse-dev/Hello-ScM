import { UserX } from "lucide-react";

export default function UserNotFound() {
  return (
    <div className="m-auto flex flex-col items-center">
      <UserX size={70} />
      <h1 className="text-3xl md:text-5xl font-bold">User Not Found!</h1>
    </div>
  );
}

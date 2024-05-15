import { Waves } from "lucide-react";

export default function GreetingUser({
  index,
  name,
}: {
  index: number;
  name: string;
}) {
  return (
    <div
      key={index}
      className="w-full h-[60vh] flex flex-col items-center justify-center mt-24"
    >
      <h1 className="text-2xl">Hello</h1>
      <h2 className="text-3xl font-semibold">{name ?? "User!"}!</h2>
      <div className="w-24 h-24 p-1 bg-blue-500 grid place-items-center">
        <Waves style={{ color: "rgb(59 130 246)" }} size={80} />
      </div>
    </div>
  );
}

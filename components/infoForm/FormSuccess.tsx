import { Check } from "lucide-react";

function FormSuccess({ pesan }: { pesan?: string }) {
  return (
    <div className="w-full h-[3rem] flex items-center justify-center bg-green-300 border-2 border-green-700 gap-x-1">
      <Check />
      <p className="text-sm">{pesan}</p>
    </div>
  );
}

export default FormSuccess;

import { AlertTriangle } from "lucide-react";

function FormError({ pesan }: { pesan?: string }) {
  return (
    <div className="w-full h-[3rem] flex items-center bg-red-400 bg-opacity-60 border-2 border-red-700 justify-center gap-x-1">
      <AlertTriangle />
      <p className="text-sm">{pesan}</p>
    </div>
  );
}

export default FormError;

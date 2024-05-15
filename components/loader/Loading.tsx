import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="m-auto">
      <Loader2 size={30} className="animate-spin" />
    </div>
  );
}

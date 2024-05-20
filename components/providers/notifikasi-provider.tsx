// "use client";
// import { Connection } from "@/hooks/UseCheckConnection";
// import { useEffect } from "react";
// import { toast } from "sonner";

// const NotifikasiProvider = ({ children }: { children: React.ReactNode }) => {
//   const [isOnline] = UseCheckConnection();

//   useEffect(() => {
//     if (!isOnline) {
//       toast.warning("You Are offline!", { closeButton: true });
//     }
//   }, [isOnline]);

//   return <>{children}</>;
// };

// export default NotifikasiProvider;

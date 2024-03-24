"use client";

import { useSocket } from "./providers/socket-provider";

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected) {
    return <button className="">Wait</button>;
  }

  return <button className="">Connected</button>;
};

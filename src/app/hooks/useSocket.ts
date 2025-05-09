import { io } from "socket.io-client";
import { useEffect } from "react";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";
const socket = io(SOCKET_URL);

export const useSocket = () => {
  const emitCardMoved = (
    cardId: string,
    sourceColumn: string,
    targetColumn: string
  ) => {
    socket.emit("cardMoved", { cardId, sourceColumn, targetColumn });
  };

  useEffect(() => {
    return () => {
      socket.off("cardMoved");
    };
  }, []);

  return {
    socket,
    emitCardMoved,
  };
};

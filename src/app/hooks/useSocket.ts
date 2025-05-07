import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:4000");

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

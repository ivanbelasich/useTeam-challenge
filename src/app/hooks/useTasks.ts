import { useState, useEffect } from "react";
import { Task, TaskStatus } from "../lib/types";
import { useSocket } from "./useSocket";
import axios from "axios";

const API_URL = "http://localhost:4001";

interface MongoTask {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { socket } = useSocket();

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/tasks`);
      const mappedTasks = data.map((task: MongoTask) => ({
        ...task,
        id: task._id,
      }));
      setTasks(mappedTasks);
    } catch (err) {
      console.error("Error fetching tasks:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id: string, task: Partial<Task>) => {
    try {
      socket.emit("taskUpdated", {
        id,
        title: task.title,
        description: task.description,
      });
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      socket.emit("taskDeleted", id);
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      socket.emit("cardMoved", {
        cardId: id,
        targetColumn: status,
      });
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();

    if (!socket) return;

    socket.on(
      "cardMoved",
      (data: { cardId: string; targetColumn: TaskStatus }) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === data.cardId
              ? { ...task, status: data.targetColumn }
              : task
          )
        );
      }
    );

    socket.on("taskUpdated", (updatedTask: MongoTask) => {
      const mappedTask = {
        ...updatedTask,
        id: updatedTask._id,
      };
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === mappedTask.id ? mappedTask : task
        )
      );
    });

    socket.on("taskDeleted", (id: string) => {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    });

    return () => {
      socket.off("cardMoved");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [socket]);

  return {
    tasks,
    loading,
    error,
    updateTask,
    deleteTask,
    updateTaskStatus,
    refreshTasks: fetchTasks,
  };
}

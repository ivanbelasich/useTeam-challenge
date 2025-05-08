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
      const { data: updatedTask } = await axios.put(
        `${API_URL}/tasks/${id}`,
        task
      );
      const mappedTask = { ...updatedTask, id: updatedTask._id };
      setTasks((prev) => prev.map((t) => (t.id === id ? mappedTask : t)));
      return mappedTask;
    } catch (err) {
      console.error("Error updating task:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    try {
      const { data: updatedTask } = await axios.put(
        `${API_URL}/tasks/${id}/status`,
        { status }
      );
      const mappedTask = { ...updatedTask, id: updatedTask._id };
      setTasks((prev) => prev.map((t) => (t.id === id ? mappedTask : t)));
      return mappedTask;
    } catch (err) {
      console.error("Error updating task status:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      throw err;
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on(
      "cardMoved",
      (data: { cardId: string; targetColumn: TaskStatus }) => {
        updateTaskStatus(data.cardId, data.targetColumn);
      }
    );

    return () => {
      socket.off("cardMoved");
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

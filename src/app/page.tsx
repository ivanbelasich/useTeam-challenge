'use client';
import type { Column as ColumnType } from './lib/types';
import { Column } from './components/Column';
import { DndContext, DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useSocket } from './hooks/useSocket';
import { useTasks } from './hooks/useTasks';
import { TaskStatus, Task } from './lib/types';

const columns: ColumnType[] = [
  { id: 'TODO', title: 'Por Hacer' },
  { id: 'IN_PROGRESS', title: 'En Progreso' },
  { id: 'DONE', title: 'Completado' },
];

export default function Home() {
  const { tasks, loading, error, updateTaskStatus, updateTask, deleteTask, createTask } = useTasks();
  const { emitCardMoved } = useSocket();

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find(t => t.id === taskId);

    if (active.id !== over.id && task) {
      try {
        await updateTaskStatus(taskId, newStatus);
        emitCardMoved(taskId, task.status, newStatus);
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  const handleEditTask = async (task: Task) => {
    try {
      await updateTask(task.id, {
        title: task.title,
        description: task.description,
      });
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleCreateTask = async (task: { title: string; description: string; status: TaskStatus }) => {
    try {
      await createTask(task);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-4 text-neutral-100">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="flex min-h-screen items-center justify-center bg-neutral-900 p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <main className="min-h-screen w-full bg-neutral-900 p-4 sm:p-6">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {columns.map((column) => (
              <div key={column.id} className="w-full">
                <Column
                  column={column}
                  tasks={tasks.filter((task) => task.status === column.id)}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                  onCreateTask={handleCreateTask}
                />
              </div>
            ))}
          </div>
        </div>
      </DndContext>
    </main>
  );
}
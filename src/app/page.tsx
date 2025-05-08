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
  const { tasks, loading, error, updateTaskStatus, updateTask, deleteTask } = useTasks();
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

  if (loading) {
    return <div className="p-4">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <main className="min-h-screen bg-neutral-900 p-8">
      <DndContext
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <div className="mx-auto flex max-w-7xl gap-8">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              tasks={tasks.filter((task) => task.status === column.id)}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </div>
      </DndContext>
    </main>
  );
}

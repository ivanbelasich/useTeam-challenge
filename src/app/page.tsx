'use client';
import { useState, useEffect } from 'react';
import type { Task, Column as ColumnType } from './lib/types';
import { Column } from './components/Column';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useSocket } from './hooks/useSocket';

const COLUMNS: ColumnType[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' },
];

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Implementar WebSocket',
    description: 'Configurar Socket.io para comunicación en tiempo real',
    status: 'TODO',
  },
  {
    id: '2',
    title: 'Drag & Drop',
    description: 'Implementar funcionalidad de arrastrar y soltar tarjetas',
    status: 'IN_PROGRESS',
  },
  {
    id: '3',
    title: 'Sincronización en tiempo real',
    description: 'Asegurar que los cambios se reflejen en todos los clientes',
    status: 'TODO',
  },
  {
    id: '4',
    title: 'Diseño responsivo',
    description: 'Adaptar la interfaz para diferentes dispositivos',
    status: 'DONE',
  },
  {
    id: '5',
    title: 'Testing',
    description: 'Implementar pruebas unitarias y de integración',
    status: 'TODO',
  }
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const { socket, emitCardMoved } = useSocket();

  const handleCardMoved = ((data: { cardId: string; targetColumn: string }) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === data.cardId
          ? { ...task, status: data.targetColumn as Task['status'] }
          : task
      )
    );
  });

  useEffect(() => {
    socket.on('cardMoved', handleCardMoved);
    return () => {
      socket.off('cardMoved', handleCardMoved);
    };
  }, [handleCardMoved]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Task['status'];

    setTasks(() =>
      tasks.map((task) =>
        task.id === taskId
          ? {
            ...task,
            status: newStatus,
          }
          : task,
      ),
    );

    const task = tasks.find(t => t.id === taskId);
    if (task) {
      emitCardMoved(taskId, task.status, newStatus);
    }
  }

  return (
    <div className="p-4">
      <div className="flex gap-8">
        <DndContext onDragEnd={handleDragEnd}>
          {COLUMNS.map((column) => {
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks.filter((task) => task.status === column.id)}
              />
            );
          })}
        </DndContext>
      </div>
    </div>
  );
}

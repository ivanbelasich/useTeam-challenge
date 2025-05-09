import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task, TaskStatus } from '../lib/types';
import { useState } from 'react';

type ColumnProps = {
    column: ColumnType;
    tasks: Task[];
    onEditTask: (task: Task) => Promise<void>;
    onDeleteTask: (id: string) => Promise<void>;
    onCreateTask: (task: { title: string; description: string; status: TaskStatus }) => Promise<void>;
};

export function Column({ column, tasks, onEditTask, onDeleteTask, onCreateTask }: ColumnProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    const handleCreateTask = async () => {
        if (!title.trim() || !description.trim()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await onCreateTask({
                title,
                description,
                status: column.id,
            });
            setTitle('');
            setDescription('');
            setIsCreating(false);
        } catch (error) {
            console.error('Error creating task:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <h2 className="text-lg font-semibold text-neutral-100">{column.title}</h2>
            <div
                ref={setNodeRef}
                className="flex flex-col gap-4 rounded-lg bg-neutral-800 p-3 sm:p-4"
            >
                {tasks.map((task) => {
                    return (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={onEditTask}
                            onDelete={onDeleteTask}
                        />
                    );
                })}

                {isCreating ? (
                    <div className="flex flex-col gap-2 rounded-lg bg-neutral-700 p-3 sm:p-4">
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="rounded bg-neutral-600 px-2 py-1 text-sm sm:text-base text-neutral-100"
                            placeholder="Título"
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="rounded bg-neutral-600 px-2 py-1 text-sm sm:text-base text-neutral-100"
                            placeholder="Descripción"
                            rows={3}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="rounded bg-neutral-600 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-neutral-100 hover:bg-neutral-500"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCreateTask}
                                disabled={isSubmitting || !title.trim() || !description.trim()}
                                className="rounded bg-blue-600 px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-default"
                            >
                                {isSubmitting ? 'Creando...' : 'Crear'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsCreating(true)}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-600 p-3 sm:p-4 text-xs sm:text-sm text-neutral-400 hover:border-neutral-500 hover:text-neutral-300"
                    >
                        <span>+</span>
                        <span>Agregar tarea</span>
                    </button>
                )}
            </div>
        </div >
    );
}
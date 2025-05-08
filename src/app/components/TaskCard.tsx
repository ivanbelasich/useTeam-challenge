import { useDraggable } from '@dnd-kit/core';
import { Task } from '../lib/types';
import { useState } from 'react';

type TaskCardProps = {
    task: Task;
    onEdit: (task: Task) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
};

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title);
    const [description, setDescription] = useState(task.description);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: {
            taskId: task.id,
            status: task.status
        }
    });


    if (!task?.id) {
        console.error('Invalid task data:', task);
        return null;
    }

    const handleEdit = async () => {
        if (isEditing) {
            setIsSubmitting(true);
            try {
                await onEdit({
                    ...task,
                    title,
                    description,
                });
                setIsEditing(false);
            } catch (error) {
                console.error('Error al editar la tarea:', error);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            setIsEditing(true);
        }
    };

    const handleCancel = () => {
        setTitle(task.title);
        setDescription(task.description);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
            try {
                await onDelete(task.id);
            } catch (error) {
                console.error('Error al eliminar la tarea:', error);
            }
        }
    };

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
            opacity: isDragging ? 0.5 : 1,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...(!isEditing ? listeners : {})}
            {...(!isEditing ? attributes : {})}
            className={`cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md ${isDragging ? 'opacity-50' : ''}`}
            style={style}
        >
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="rounded bg-neutral-600 px-2 py-1 text-neutral-100"
                        placeholder="Título"
                    />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="rounded bg-neutral-600 px-2 py-1 text-neutral-100"
                        placeholder="Descripción"
                        rows={3}
                    />
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleCancel}
                            className="rounded bg-neutral-600 px-3 py-1 text-sm text-neutral-100 hover:bg-neutral-500"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleEdit}
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="mb-2 font-semibold text-neutral-100">{task.title}</h3>
                    <p className="mb-4 text-sm text-neutral-300">{task.description}</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={handleEdit}
                            className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
                        >
                            Editar
                        </button>
                        <button
                            onClick={handleDelete}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-500"
                        >
                            Eliminar
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
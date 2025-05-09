import { useDraggable } from '@dnd-kit/core';
import { Task } from '../lib/types';
import { useState } from 'react';
import { ConfirmDialog } from './ConfirmDialog';

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
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: {
            taskId: task.id,
            status: task.status
        }
    });

    if (!task?.id) {
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
        try {
            await onDelete(task.id);
        } catch (error) {
            console.error('Error al eliminar la tarea:', error);
        }
    };

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
            opacity: isDragging ? 0.5 : 1,
        }
        : undefined;

    return (
        <>
            <div
                ref={setNodeRef}
                {...(!isEditing ? listeners : {})}
                {...(!isEditing ? attributes : {})}
                className={`cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md hover:ring-2 hover:ring-neutral-500 ${isDragging ? 'opacity-50' : ''}`}
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
                                className="rounded cursor-pointer bg-neutral-600 px-3 py-1 text-sm text-neutral-100 hover:bg-neutral-500"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleEdit}
                                className="rounded cursor-pointer bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-500"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between items-center gap-2">
                            <h3 className="font-semibold text-neutral-100">{task.title}</h3>
                            <div className="flex gap-1">
                                <button
                                    onClick={handleEdit}
                                    className="rounded cursor-pointer p-1.5 text-neutral-400 hover:text-neutral-200 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="rounded cursor-pointer p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-neutral-300">{task.description}</p>
                    </>
                )}
            </div>
            <ConfirmDialog
                isOpen={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                message="¿Deseas eliminar esta tarea?"
            />
        </>
    );
}
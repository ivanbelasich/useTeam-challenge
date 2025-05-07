import { useDraggable, useDndMonitor } from '@dnd-kit/core';
import { Task } from '../lib/types';

type TaskCardProps = {
    task: Task;
    onDrop?: (taskId: string, sourceColumnId: string, targetColumnId: string) => void;
};

export function TaskCard({ task, onDrop }: TaskCardProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id,
        data: {
            sourceColumnId: task.status
        }
    });

    useDndMonitor({
        onDragEnd: (event) => {
            if (event.active.id === task.id && onDrop) {
                const sourceColumnId = event.active.data.current?.sourceColumnId;
                const targetColumnId = event.over?.id as string;
                if (sourceColumnId && targetColumnId) {
                    onDrop(task.id, sourceColumnId, targetColumnId);
                }
            }
        },
    });

    const style = transform
        ? {
            transform: `translate(${transform.x}px, ${transform.y}px)`,
        }
        : undefined;

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className="cursor-grab rounded-lg bg-neutral-700 p-4 shadow-sm hover:shadow-md"
            style={style}
        >
            <h3 className="font-medium text-neutral-100">{task.title}</h3>
            <p className="mt-2 text-sm text-neutral-400">{task.description}</p>
        </div>
    );
}
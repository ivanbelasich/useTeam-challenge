import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task } from '../lib/types';
import { useSocket } from '../hooks/useSocket';

type ColumnProps = {
    column: ColumnType;
    tasks: Task[];
};

export function Column({ column, tasks }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: column.id,
    });
    const { emitCardMoved } = useSocket();

    const handleDrop = (taskId: string, sourceColumnId: string, targetColumnId: string) => {
        emitCardMoved(taskId, sourceColumnId, targetColumnId);
    };

    return (
        <div className="flex w-80 flex-col rounded-lg bg-neutral-800 p-4">
            <h2 className="mb-4 font-semibold text-neutral-100">{column.title}</h2>
            <div ref={setNodeRef} className="flex flex-1 flex-col gap-4">
                {tasks.map((task) => {
                    return <TaskCard key={task.id} task={task} onDrop={handleDrop} />;
                })}
            </div>
        </div>
    );
}
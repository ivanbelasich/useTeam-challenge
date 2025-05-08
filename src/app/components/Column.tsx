import { useDroppable } from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column as ColumnType, Task } from '../lib/types';

type ColumnProps = {
    column: ColumnType;
    tasks: Task[];
    onEditTask: (task: Task) => Promise<void>;
    onDeleteTask: (id: string) => Promise<void>;
};

export function Column({ column, tasks, onEditTask, onDeleteTask }: ColumnProps) {

    const { setNodeRef } = useDroppable({
        id: column.id,
    });

    return (
        <div className="flex w-80 flex-col gap-4">
            <h2 className="text-lg font-semibold text-neutral-100">{column.title}</h2>
            <div
                ref={setNodeRef}
                className="flex min-h-[200px] flex-col gap-4 rounded-lg bg-neutral-800 p-4"
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
            </div>
        </div>
    );
}
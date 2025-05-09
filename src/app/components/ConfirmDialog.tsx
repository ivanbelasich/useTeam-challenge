import { useEffect, useRef } from 'react';

type ConfirmDialogProps = {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    message: string;
};

export function ConfirmDialog({ isOpen, onClose, onConfirm, message }: ConfirmDialogProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        if (isOpen) {
            dialog.showModal();
        } else {
            dialog.close();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <dialog
            ref={dialogRef}
            className="backdrop:bg-black/50 rounded-lg bg-neutral-800 p-6 text-neutral-100 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-[280px] shadow-xl border border-neutral-700"
            onCancel={onClose}
        >
            <p className="text-base mb-6 text-center">{message}</p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={onClose}
                    className="cursor-pointer px-4 py-2 rounded bg-neutral-700 text-sm text-neutral-200 hover:bg-neutral-600 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    onClick={onConfirm}
                    className="cursor-pointer px-4 py-2 rounded bg-red-600 text-sm text-white hover:bg-red-500 transition-colors"
                >
                    Eliminar
                </button>
            </div>
        </dialog>
    );
} 
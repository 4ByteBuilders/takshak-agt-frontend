interface DialogProps {
    title: string;
    message: string;
    onClose: () => void;
}

export default function Dialog({ title, message, onClose }: DialogProps) {
    return (
        <div className="mt-8 bg-gray-800 text-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-xl font-bold mb-4">{title}</h2>
            <p className="mb-4">{message}</p>
            <button className="mt-4 bg-amber-500 text-white px-4 py-1 rounded" onClick={onClose}>
                Ok
            </button>
        </div>
    );
}

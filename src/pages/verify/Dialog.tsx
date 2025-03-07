import { motion, AnimatePresence } from "framer-motion";

interface DialogProps {
    title: string;
    message: string;
    onClose: () => void;
}

export default function Dialog({ title, message, onClose }: DialogProps) {
    return (
        <AnimatePresence>
            {/* Overlay */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                onClick={onClose} // Close dialog when clicking outside
            >
                {/* Dialog Box */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-800 text-white rounded-lg p-6 w-11/12 md:w-1/2 lg:w-1/3 relative"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
                >
                    {/* Title */}
                    <h2 className="text-xl font-bold mb-4">{title}</h2>

                    {/* Message */}
                    <p className="mb-4 text-gray-300">{message}</p>

                    {/* Close Button */}
                    <button
                        className="mt-4 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
                        onClick={onClose}
                    >
                        Ok
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
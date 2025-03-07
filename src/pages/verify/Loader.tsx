import { Loader2 } from "lucide-react";

export default function Loader() {
    return (
        <div className="flex items-center justify-center my-4 gap-3">
            <Loader2 size={30} className="animate-spin" />
            <h2 className="text-xl font-bold">Verifying Pass...</h2>
        </div>
    );
}

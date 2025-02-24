
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../button"

function Navbar() {
    return (
        <div className="fixed top-0 left-0 w-full shadow-sm shadow-slate-700">
            <div className="flex items-center p-2 justify-between">
                <div className="flex gap-4 items-center font-alfa text-2xl">
                    <img src="/takshak-logo.png" className="max-h-10" />
                    Takshak
                </div>
                <div className="flex gap-4 items-center">
                    <Button variant={"secondary"}>My Tickets</Button>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>
        </div>
    )
}

export default Navbar
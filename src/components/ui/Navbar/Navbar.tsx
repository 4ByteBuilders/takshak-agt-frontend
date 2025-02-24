import { supabase } from "@/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../button"
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const isLoggedIn = useRef(false);
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    }

    useEffect(() => {
        const checkUser = async () => {
            isLoggedIn.current = await supabase.auth.getUser() ? true : false;
        };
        checkUser();
    }, [])
    return (
        <div className="fixed top-0 left-0 w-full shadow-sm shadow-slate-700">
            <div className="flex items-center p-2 justify-between">
                <div className="flex gap-4 items-center font-alfa text-2xl">
                    <img src="/takshak-logo.png" className="max-h-10" />
                    Takshak
                </div>
                <div className="flex gap-4 items-center">
                    {isLoggedIn.current ?
                        <Button variant={"secondary"}>My Tickets</Button> :
                        <Button onClick={handleLoginClick}>Login</Button>}
                    {isLoggedIn.current ? (
                        <Avatar>
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export default Navbar
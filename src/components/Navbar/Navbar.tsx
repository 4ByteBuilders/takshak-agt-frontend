import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/Providers/AuthProvider";
import {
  UserRound,
  UserCog,
  LogOut,
  CircleHelp,
  Ticket,
  Menu,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/supabaseClient";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleMyTicketsClick = async () => {
    navigate("/tickets");
  };
  const handlePendingTicketsClick = async () => {
    navigate("/pending-booking");
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
  };

  const isFixed = location.pathname === "/" || location.pathname === "/login";

  return (
    <div
      className={`${
        isFixed ? "fixed" : "relative"
      } top-0 left-0 w-full bg-opacity-0 text-white z-10`}
    >
      <div className="flex items-center p-2 justify-between">
        <div
          className="flex gap-4 items-center font-alfa text-2xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src="/takshak-logo.png" className="max-h-10" />
          <span className="hidden md:block">Takshak</span>
        </div>
        <div className="flex gap-4 items-center ml-auto">
          <div className="hidden md:flex gap-4 items-center">
            {user ? (
              <>
                <Button
                  variant={"secondary"}
                  onClick={handlePendingTicketsClick}
                >
                  Pending Tickets
                </Button>
                <Button variant={"secondary"} onClick={handleMyTicketsClick}>
                  My Tickets
                </Button>
              </>
            ) : (
              <Button onClick={handleLoginClick}>Login</Button>
            )}
          </div>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage src={user.user_metadata.picture} />
                  <AvatarFallback>
                    <UserRound />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="">
                <DropdownMenuLabel>
                  <div className="flex items-center">
                    <UserRound />
                    <span className="ml-2">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <div className="flex items-center">
                    <UserCog />
                    <span className="ml-2">Profile</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center">
                    <Ticket />
                    <span className="ml-2">My Tickets</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex items-center">
                    <CircleHelp />
                    <span className="ml-2">FAQ</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center">
                        <LogOut />
                        <span className="ml-2">Logout</span>
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to logout?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will log you out of the application.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleLogOut}>
                          Logout
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}
          <DropdownMenu>
            <DropdownMenuTrigger className="md:hidden">
              <Menu />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="md:hidden">
              {user ? (
                <>
                  <DropdownMenuItem onClick={handlePendingTicketsClick}>
                    Pending Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleMyTicketsClick}>
                    My Tickets
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogOut}>
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={handleLoginClick}>
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}

export default Navbar;

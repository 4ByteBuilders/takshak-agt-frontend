import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/Providers/AuthProvider";
import { supabase } from "@/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "../ui/button";
import { UserRound, UserCog, LogOut, History, Menu, Ticket, BadgeIndianRupee } from "lucide-react";
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

function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const handleLoginClick = () => {
    navigate("/login");
  };
  const handleMyTicketsClick = async () => {
    navigate("/tickets");
  };
  const handlePendingTicketsClick = async () => {
    navigate("/pending-booking");
  };
  const handleHomeTicketsClick = async () => {
    navigate("/");
  };
  const handleBookingHistoryClick = async () => {
    navigate("/booking-history");
  };

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    }
    navigate("/");
  };

  // Check if the current route is "/login"
  const isLoginRoute = location.pathname === "/login";

  return (
    <div className="absolute top-0 left-0 w-full bg-opacity-0 text-white z-10">
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
                  Pending Payments
                </Button>
                <Button variant={"secondary"} onClick={handleMyTicketsClick}>
                  My Tickets
                </Button>
              </>
            ) :
              !isLoginRoute ? (
                <Button onClick={handleLoginClick}>Login</Button>
              ) : (
                <Button onClick={handleHomeTicketsClick}>Home</Button>
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
                  <div className="flex items-center py-2 border-b-2 w-full">
                    <UserCog />
                    <span className="ml-2">Profile</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center py-2 w-full">
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
          {!isLoginRoute && (
            <DropdownMenu>
              <DropdownMenuTrigger className="md:hidden mr-4">
                <Menu size={35} />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="md:hidden">
                {user ? (
                  <>
                    <DropdownMenuItem onClick={handlePendingTicketsClick} className="py-3 border-b-2">
                      <div className="flex items-center gap-2">
                        <BadgeIndianRupee />
                        <span>Pending Payments</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleMyTicketsClick} className="py-3 border-b-2">
                      <div className="flex items-center gap-2">
                        <Ticket />
                        <span>My Tickets</span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleBookingHistoryClick} className="py-3">
                      <div className="flex items-center">
                        <History />
                        <span className="ml-2">Booking History</span>
                      </div>
                    </DropdownMenuItem>
                  </>
                ) : (

                  <DropdownMenuItem onClick={handleLoginClick} className="py-3">
                    Login
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;

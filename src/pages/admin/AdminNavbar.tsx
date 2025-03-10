import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/Providers/AuthProvider";
import { supabase } from "@/supabaseClient";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  UserCog,
  LogOut,
  Mail,
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
import { toast } from "sonner";

function AdminNavbar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message || "An error occurred while logging out.");
    }
    localStorage.clear();
    window.location.href = `${import.meta.env.VITE_FRONTEND_ADMIN_URL}`;
  };

  return (
    <div className="absolute top-0 left-0 w-full bg-opacity-0 text-white z-10">
      <div className="flex items-center p-2 justify-between mr-4">
        <div
          className="flex gap-4 items-center font-alfa text-2xl cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src="/takshak-logo.png"
            className="max-h-10"
            alt="Takshak logo"
          />
          <span className="hidden md:block">Takshak</span>
        </div>
        <div className="flex gap-4 items-center ml-auto">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={user.user_metadata.picture}
                    alt="User Avatar"
                  />
                  <AvatarFallback>
                    <UserCog size={20} />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  <div className="flex items-center">
                    <Mail size={16} />
                    <span className="ml-2">{user.email}</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex items-center gap-2 py-2 w-full">
                        <LogOut size={16} />
                        <span>Logout</span>
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
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;

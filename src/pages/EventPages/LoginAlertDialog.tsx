
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface LoginAlertDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onGoogleLogin: () => void;
}

export default function LoginAlertDialog({ open, onOpenChange, onGoogleLogin }: LoginAlertDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        You have to sign in with google to lock tickets.
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action will redirect you to the login page.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onGoogleLogin}>
                        Sign In with Google
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

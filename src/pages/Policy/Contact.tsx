import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { supabase } from "@/supabaseClient";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    message: z.string().min(4, {
        message: "Message must be at least 4 characters.",
    }),
});

const Contact = () => {
    const [showDialog, setShowDialog] = useState({ status: false, title: "", message: "" });
    const [loading, setLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setLoading(true);
            const { data } = await supabase.auth.getSession();
            const auth = data.session?.access_token;
            axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/policy/create`, values);
            setShowDialog({
                status: true,
                title: "Success",
                message: "Your message has been sent successfully. We will get back to you soon.",
            });

            setLoading(false);
            form.reset();
        } catch (error) {
            setShowDialog({
                status: true,
                title: "Error",
                message: (axios.isAxiosError(error) && error.response?.data?.message) ? error.response.data.message + ". Please try again later." : "An unexpected error occurred. Please try again later.",
            });
            setLoading(false);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center pb-40 px-4 pt-16">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} disabled={loading} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="example@domain.com" {...field} disabled={loading} />
                                </FormControl>
                                <FormDescription>
                                    This is your email address.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Your message here..." {...field} disabled={loading} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {
                            loading ? (
                                <Button disabled>
                                    <Loader2 className="animate-spin" />
                                    Please wait
                                </Button>
                            ) : (<Button type="submit" className="w-1/2" disabled={loading}>
                                Submit
                            </Button>)
                        }
                    </div>
                </form>
            </Form>

            <AlertDialog open={showDialog.status} onOpenChange={(open) => setShowDialog(prev => ({ ...prev, status: open }))}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{showDialog.title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {showDialog.message}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setShowDialog({
                            status: false,
                            title: "",
                            message: "",
                        })}>OK</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Contact;

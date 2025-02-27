import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { Textarea } from "@/components/ui/textarea";
import axios from "axios";
import { supabase } from "@/supabaseClient";
// import { useState } from "react";

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
})

const Contact = () => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            message: "",
        },
    })
    // const [loading, setLoading] = useState(false);
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            // setLoading(true);
            const { data } = await supabase.auth.getSession();
            console.log(data.session?.access_token);
            const auth = data.session?.access_token;
            axios.defaults.headers.common["Authorization"] = `Bearer ${auth}`;
            const response = await axios.post("/policy/create", values);
            if (response.status % 100 === 2) {
                alert("Message sent successfully!");
            }
            form.reset();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="flex items-center justify-center pt-7 pb-40 px-4">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full max-w-md">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Name" {...field} />
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
                                    <Input placeholder="example@domain.com" {...field} />
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
                                    <Textarea placeholder="Your message here..." {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        <Button type="submit" className="w-1/2">Submit</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default Contact;

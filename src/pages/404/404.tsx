import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"



function Page404() {
    const navigator = useNavigate();
    const navigateToHomePage = () => {
        navigator("/");
    }
    return (
        <div className="flex flex-col items-center justify-center text-center h-full p-5 text-4xl font-extrabold">
            <p className="mb-7 max-w-lg">
                404 - Page Not Found
            </p>
            <Button onClick={navigateToHomePage}>
                Go to HomePage
            </Button>
        </div>
    )
}

export default Page404
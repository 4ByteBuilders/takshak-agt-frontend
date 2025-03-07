import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";
import { getWithExpiry } from "@/utils/fetchLocalStorage";

const CallBack = () => {

    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(false);
        const handleCallback = async () => {
            const redirectUrl = getWithExpiry("redirectUrl");
            navigate(redirectUrl);
        };
        handleCallback();
    }, []);

    return (
        <div>
            {loading ? <Loader /> : null}
        </div>
    );

}

export default CallBack;
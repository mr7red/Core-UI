import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GithubSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        console.log("TOKEN:", token);

        if (token) {
            localStorage.setItem("token", token);

            alert("Login Successfully");

            navigate("/dashboard");
        } else {
            alert("Login Failed");
            navigate("/login");
        }
    }, []);

    return <div>Logging in...</div>;
};

export default GithubSuccess;
import { useLocation } from "react-router-dom";

function Login() {
    const location = useLocation();
    return (
        <div id="cart">
            Login page location: {location.pathname}
        </div>
    )
}

export default Login
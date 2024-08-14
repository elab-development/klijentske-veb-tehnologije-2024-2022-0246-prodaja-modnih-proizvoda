import { useLocation } from "react-router-dom";

function Cart() {
    const location = useLocation();
    return (
        <div id="cart">
            Cart location: {location.pathname}
        </div>
    )
}

export default Cart
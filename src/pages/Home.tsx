import { useLocation } from "react-router-dom";
import { Product } from '../models/productModel';

interface HomeProps {
    products: Product[];
}

function Home(props: HomeProps) {
    const location = useLocation();
    const recommended: Product[] = props.products.filter((product) => product.recommended);
    return (
        <div id="cart">
            <div>Home page location: {location.pathname}</div>
            <div>Recommended products data: { JSON.stringify(recommended)}</div>
        </div>
    )
}

export default Home
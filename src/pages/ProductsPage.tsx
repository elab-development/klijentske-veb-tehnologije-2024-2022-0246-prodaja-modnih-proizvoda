import { useLocation } from "react-router-dom";
import { Product } from "../models/productModel";

interface ProductPageProps {
    products: Product[];
}

function ProductsPage(props: ProductPageProps) {
    const location = useLocation();
    const products = props.products;
    return (
        <div id="cart">
            <div>Products Page location: {location.pathname}</div>
            <div>Products data: {JSON.stringify(products)}</div>
        </div>
    )
}

export default ProductsPage
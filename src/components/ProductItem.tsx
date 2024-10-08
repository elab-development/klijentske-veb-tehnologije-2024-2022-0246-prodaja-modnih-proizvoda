import { MdOutlineFavorite } from "react-icons/md";
import { Product } from "../models/productModel"
import './ProductItem.css'
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";

interface ProductItemProps {
    product: Product;
    /* lifted up properties to App */
    onAdd: (productId: number | string) => void;
    onRemove: (productId: number | string) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({product, onAdd}) => {
    const navigate = useNavigate();
    return (
        <div className="product-item" style={{backgroundImage: `url('${product.images[0]}')`}} onClick={() => navigate(`/products/${product.productid}`)}>
            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                <div className="pi-menu">
                    <div className="pi-price">$ {product.price}</div>
                    <div className="pi-to-cart"><a onClick={(event) => {event.stopPropagation();onAdd(product.productid); navigate("/cart"); window.scrollTo(0,0);}}>Add to cart</a></div>
                    <div className="pi-fav" onClick={(event) => {event.stopPropagation()/* extra logic for favourites */}}><MdOutlineFavorite/></div>
                </div>
            </IconContext.Provider>
        </div>
    )
}

export default ProductItem
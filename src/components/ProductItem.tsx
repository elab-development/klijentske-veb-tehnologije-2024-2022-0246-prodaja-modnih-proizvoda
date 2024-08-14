import { MdOutlineFavorite } from "react-icons/md";
import { Product } from "../models/productModel"
import './ProductItem.css'
import { IconContext } from "react-icons";

interface ProductItemProps {
    product: Product;
}

const ProductItem: React.FC<ProductItemProps> = ({product}) => {

    return (
        <div className="product-item" style={{backgroundImage: `url('/img/products/${product.image}')`}}>
            <IconContext.Provider value={{ size: "1.5em", color: "white" }}>
                <div className="pi-menu">
                    <div className="pi-price">$ {product.price}</div>
                    <div className="pi-to-cart"><a>Add to cart</a></div>
                    <div className="pi-fav"><MdOutlineFavorite/></div>
                </div>
            </IconContext.Provider>
        </div>
    )
}

export default ProductItem
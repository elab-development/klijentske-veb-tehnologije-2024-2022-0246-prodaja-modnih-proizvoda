import { useEffect,/*, useState*/ 
useState} from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Product, Size } from "../models/productModel";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MdOutlineFavorite, MdStar, MdStarBorder } from "react-icons/md";
import Rating from 'react-rating';

interface ProductPageProps {
    acceptProductCode: (code: number | string) => void;
    loadingProduct: boolean;
    product: Product;
    addToCart: (product: Product, size?: Size, amount?: number) => void;
    apiRequestsRemaining: number;
}

const ProductPage = ({acceptProductCode, loadingProduct, product, addToCart, apiRequestsRemaining}: ProductPageProps) => {
    const params = useParams();
    const navigate = useNavigate();

    const [size, setSize] = useState<Size | undefined>(undefined);

    useEffect(() => acceptProductCode(params.productId as string), [params.productId, acceptProductCode]);

    const handleSelect = (ev: React.ChangeEvent<HTMLSelectElement>)  => {
        const value = ev.target.value;
        if (value === "0") {setSize(undefined);} else {setSize(value as Size);}
    }
    
    return (
        <div style={{color: 'black'}}>{loadingProduct ? (<p>Loading product {params.productId} data, please wait...</p>) : product && (
            <div>
                <p>{JSON.stringify(product)}</p>
                <div className="product-details">
                    <div className="image-gallery">
                        <ImageGallery
                            items={product.images.map((el) => {
                                return {original: el, thumbnail: el, originalWidth: 1000, originalHeight: 600, thumbnailWidth: 250, thumbnailHeight: 150};
                            })}
                            thumbnailPosition="left"
                            showNav={false}
                        />
                    </div>
                    <div className="product-basic">
                        <div className="product-name">{product.name}</div>
                        <div className="product-price">{product.price}</div>
                        <div className="product-rating"><Rating stop={10} step={2} fractions={2} emptySymbol={<MdStarBorder />} fullSymbol={<MdStar />}/></div>
                        <div className="select-size">
                            <select onChange={handleSelect} value={size}>
                                <option value={0}>Select size...</option>
                                {Object.keys(product.amounts).map((size) => (<option value={size} key={size}>{size}</option>))}
                            </select>
                        </div>
                        <div className="to-cart">
                            <div className="add-to-cart"><a onClick={(event) => {event.stopPropagation();addToCart(product, size); navigate("/cart"); window.scrollTo(0,0);}}>Add to cart</a></div>
                            <div className="fav" onClick={(event) => {event.stopPropagation()/* extra logic for favourites */}}><MdOutlineFavorite/></div>
                        </div>
                    </div>
                </div>
                <div className="desc-avail">
                    <div className="product-desc">{product.description}</div>
                    <div className="product-avail">
                        <select>
                            <option value={0}>Select store..</option>
                            <option value={1}>Store 1</option>
                            <option value={2}>Store 2</option>
                        </select>
                    </div>
                </div>
                <div className="similar-products">
                </div>
                <p>API requests remaining (this month): {apiRequestsRemaining}</p>
            </div>
        )}</div>
    )
}

export default ProductPage
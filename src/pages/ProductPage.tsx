import { useEffect,/*, useState*/ 
useState} from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Product, Size } from "../models/productModel";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { MdOutlineFavorite, MdStar, MdStarBorder } from "react-icons/md";
import Rating from 'react-rating';
import './ProductPage.css';
import ProductItem from "../components/ProductItem";

interface ProductPageProps {
    acceptProductCode: (code: number | string) => void;
    loadingProduct: boolean;
    product: Product;
    addToCart: (productId: number | string, size?: Size, amount?: number) => void;
    products: Product[];
    onRemove: (productId: number | string) => void;
    apiRequestsRemaining: number;
}

const ProductPage = ({acceptProductCode, loadingProduct, product, addToCart, products, onRemove, apiRequestsRemaining}: ProductPageProps) => {
    const params = useParams();
    const navigate = useNavigate();

    const [size, setSize] = useState<Size | undefined>(undefined);

    useEffect(() => acceptProductCode(params.productId as string), [params.productId, acceptProductCode]);

    const handleSelect = (ev: React.ChangeEvent<HTMLSelectElement>)  => {
        const value = ev.target.value;
        if (value === "0") {setSize(undefined);} else {setSize(value as Size);}
    }

    // calculate similarProducts for product page when products and product data are ready
    let similarProducts: Product[] = [];
    if (products && product) {
        similarProducts = products.filter((el) => {
            if (!product) return false;
            return (el.category === product.category) && (el.productid !== product.productid); 
        });
        const countOfSP = similarProducts.length;
        if (countOfSP < 4) {
            //find more - add first 4 - countofSP of a different category
            let i = 4 - countOfSP, j = 0;
            while (i > 0 && j < products.length) {
                if (products[j].category !== product.category) {
                    similarProducts.push(products[j]);
                    i--;
                }
                j++;
            }
        } else if (countOfSP > 4) {
            //take first four
            similarProducts.splice(4, countOfSP - 4);
        }
    }
    
    return (
        <div style={{color: 'black'}}>{loadingProduct ? (<p>Loading product {params.productId} data, please wait...</p>) : product && (
            <div>
                <div className="product-details">
                    <div className="image-gallery">
                        <ImageGallery
                            items={product.images.map((el) => {
                                return {original: el, thumbnail: el, originalWidth: 800, originalHeight: 600, thumbnailWidth: 200, thumbnailHeight: 150};
                            })}
                            thumbnailPosition="left"
                            showNav={false}
                        />
                    </div>
                    <div className="product-basic">
                        <div className="product-name"><div>{product.name}</div></div>
                        <div className="product-price"><div>$ {product.price}</div></div>
                        <div className="product-rating"><Rating stop={10} step={2} fractions={2} emptySymbol={<MdStarBorder />} fullSymbol={<MdStar />}/></div>
                        <div className="select-size">
                            <select onChange={handleSelect} value={size}>
                                <option value={0}>Select size...</option>
                                {Object.keys(product.amounts).map((size) => (<option value={size} key={size}>{size}</option>))}
                            </select>
                        </div>
                        <div className="to-cart">
                            <div>
                                <div className="add-to-cart"><a onClick={(event) => {event.stopPropagation();console.log('prod', product);addToCart(product.productid, size); navigate("/cart"); window.scrollTo(0,0);}}>Add to cart</a></div>
                            </div>
                            <div>
                                <div className="fav" onClick={(event) => {event.stopPropagation()/* extra logic for favourites */}}><MdOutlineFavorite/></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="desc-avail">
                    <div className="product-desc"><h2>Description</h2><div>{product.description}</div></div>
                    <div className="product-avail">
                        <h2>Availability</h2>
                        <select>
                            <option value={0}>Select store...</option>
                            <option value={1}>Store 1</option>
                            <option value={2}>Store 2</option>
                        </select>
                    </div>
                </div>
                <div className="similar-products">
                    <h2>Similar products</h2>
                    <div>
                        {similarProducts.map((product) => (
                            <div key={product.productid} style={{padding: "1vh 1vw"}}><ProductItem product={product} onAdd={addToCart} onRemove={onRemove}/></div>
                        ))}
                    </div>
                </div>
                <p style={{textAlign: 'center'}}>API requests remaining (this month): {apiRequestsRemaining}</p>
            </div>
        )}</div>
    )
}

export default ProductPage
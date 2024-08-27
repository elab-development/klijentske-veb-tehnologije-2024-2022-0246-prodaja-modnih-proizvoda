import { Link } from 'react-router-dom'
import './Home.css'
import { MdMenu } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { Product } from '../models/productModel';
import ProductItem from '../components/ProductItem';

interface HomeProps {
    products: Product[];
    onAdd: (productId: number | string) => void;
    onRemove: (productId: number | string) => void;
    loadingProducts: boolean;
}

function Home(props: HomeProps) {
    const recommended: Product[] = props.products.filter((product) => product.recommended)
    return (
        <div id="home">
            <div id="prva">
                <IconContext.Provider value={{ size: "1.8em", color: "white" }}> 
                    <Link to="/products" id="product-link"><MdMenu /></Link>
                </IconContext.Provider>
            </div>
            <div id="druga">
                <span id="drugatekst">Collection for beach</span>
                <Link to="/collection" id="collection-link">See collection</Link>
            </div>
            <div id="prep-pro">
                <span>Recommended products</span>
                <div id="prep-grid">
                    {props.loadingProducts ? <p>Loading products, please wait...</p>: (recommended.map((product) => (
                        <div style={{padding: "1vh 1vw"}}><ProductItem key={product.productid} product={product} onAdd={props.onAdd} onRemove={props.onRemove}/></div>
                    )))}
                </div>
            </div>
        </div>
    )
}

export default Home
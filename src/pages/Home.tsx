import { Link } from 'react-router-dom'
import './Home.css'
import { MdMenu } from 'react-icons/md'
import { IconContext } from 'react-icons'
import { Product } from '../models/productModel';
import ProductItem from '../components/ProductItem';

interface HomeProps {
    products: Product[];
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
                    {recommended.map((product) => (
                        <ProductItem key={product.productid} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
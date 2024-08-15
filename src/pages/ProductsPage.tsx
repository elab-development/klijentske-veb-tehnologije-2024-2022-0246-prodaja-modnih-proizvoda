import FilterByCategory from "../components/FilterByCategory";
import ProductItem from "../components/ProductItem";
import { Product } from "../models/productModel";

import './ProductsPage.css'

interface ProductPageProps {
    products: Product[];
}

function ProductsPage(props: ProductPageProps) {
    const products = props.products;
    return (
        <div id="products-page">
            <FilterByCategory products={products} direction="row" />
            <div id="product-items">
                <div id="price-filter">
                    <div id="vert-fbc"><FilterByCategory products={products} direction="column" /></div>
                    <p className="filter-dim">Size:</p>
                    <div className="filter-sizes">
                        <div>XS</div><div>S</div><div>M</div>
                        <div>L</div><div>XL</div><div>XXL</div>
                    </div>
                    <label htmlFor="price-range">
                        <p className="filter-dim">Price:</p>
                        <input id="price-range" type="range" />
                    </label>
                </div>
                <div id="products-grid">
                    {products.map((product) => (
                        <ProductItem key={product.productid} product={product}/>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ProductsPage
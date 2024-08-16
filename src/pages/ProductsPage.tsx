import { useEffect, useState } from "react";
import FilterByCategory from "../components/FilterByCategory";
import ProductItem from "../components/ProductItem";
import { EnumKeys, ObjectKeysFromEnum, Product } from "../models/productModel";

import './ProductsPage.css';

export type FilterOperation = "eq" | "lt" | "le" | "gt" | "ge" | "in" | "bw";
export type FilterData = ObjectKeysFromEnum<Product, {operation: FilterOperation, values: string[] | number[]}>

interface ProductPageProps {
    products: Product[];
    /* lifted-up properties to App */
    onAdd: (productId: number) => void;
    onRemove: (productId: number) => void;
}

function ProductsPage(props: ProductPageProps) {
    const products = props.products;
    
    /* add to cart and remove from cart */
    const onAdd = props.onAdd;
    const onRemove = props.onRemove;

/* klijentsko filtriranje - u veb citacu - prikaza proizvoda na stranici */
const [filter, setFilter] = useState<FilterData | undefined>(undefined); // client-side filter of a product page retrieved from server
const [maxPrice, setMaxPrice] = useState(50);
const [filteredProducts, setFilteredProducts] = useState(products);

const handleRangeChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    setMaxPrice(Number(val));
    // addFilter ovde umesto u posebnom useEffects, buduci da se samo ovde ocekuje izmena maxPrice, a addFilter se koristi i iz komponente FilterByCategories
    addFilter("price", {operation: "le", values: [Number(val)]}); // val umesto maxPrice, jer ne stize da azurira interfejs prema novom maxPrice
}

const addFilter = (prodProp: EnumKeys<Product>, prod: {operation: FilterOperation, values: string[] | number[]}) => {
    let filtNewItem : FilterData | undefined;

    if (filter !== undefined ) {
        filtNewItem = { ...filter, [prodProp]: prod};
    } else {
        filtNewItem = { [prodProp]: prod } as unknown as FilterData;
    }
    setFilter(filtNewItem);
    console.log('filter', filter);
}
const removeFromFilter = (prodProp: EnumKeys<Product>) => {
    let filtNew : FilterData | undefined;

    if (filter !== undefined ) {
        filtNew = { ...filter };
        delete filtNew[prodProp];
    }
    setFilter(filtNew);
}

useEffect(() => {
    setFilteredProducts(products.filter((prod) => {
        if (filter !== undefined) {
            let acceptProd = true;
            const prodKeys = Object.keys(filter as object);
            for(const prodKey of prodKeys) {
                const filtItem = filter ? filter[prodKey as EnumKeys<Product>]: {operation: 'le', values: [0]} /* just to be type-safe */;
                const oper = filtItem.operation as FilterOperation;
                const values = filtItem.values;
                const keyValue = prod[prodKey as EnumKeys<Product>];
                switch(oper) {
                    case "eq": /* equals */
                        acceptProd = keyValue == values[0];
                        break;
                    case "ge": /* greater than or equal */
                        acceptProd = keyValue >= values[0];
                        break;
                    case "gt": /* greater than */
                        acceptProd = keyValue > values[0];
                        break;
                    case "le": /* less than or equal */
                        acceptProd = keyValue <= values[0];
                        break;
                    case "lt": /* less than */
                        acceptProd = keyValue < values[0];
                        break;
                    case "in": /* in array of values */
                        acceptProd = values.includes(keyValue as never);
                        break;
                    case "bw": /* in range - between min and max value */
                        acceptProd = (keyValue >= values[0]) && (keyValue <= values[1]);
                        break;
                    default:
                        acceptProd = false;
                }
                if (!acceptProd) {
                    break; // exit for
                }
            }
            return acceptProd;
        } else {
            return true; // take every product if no filter
        }
    }))
}, [products, filter]);
/* kraj - klijentski filter za prikaz proizvoda na stranici */
    return (
        <div id="products-page">
            <FilterByCategory products={products} direction="row" addToFilter={addFilter} removeFromFilter={removeFromFilter} />
            <div id="product-items">
                <div id="price-filter">
                    <div id="vert-fbc"><FilterByCategory products={products} direction="column" addToFilter={addFilter} removeFromFilter={removeFromFilter} /></div>
                    <p className="filter-dim">Size:</p>
                    <div className="filter-sizes">
                        <div>XS</div><div>S</div><div>M</div>
                        <div>L</div><div>XL</div><div>XXL</div>
                    </div>
                    <label htmlFor="price-range">
                        <p className="filter-dim">Price:</p>
                        <input id="price-range" type="range" max={50} value={maxPrice} onChange={handleRangeChange} />
                        <p style={{textAlign: 'center'}}>less than or equals {maxPrice}</p>
                    </label>
                </div>
                <div id="products-grid">
                    {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                        <ProductItem key={product.productid} product={product} onAdd={onAdd} onRemove={onRemove}/>
                    )) : <span style={{color: 'black'}}>No products matching your criteria.</span>}
                </div>
            </div>
        </div>
    )
}

export default ProductsPage
import { useEffect, useState } from "react";
import FilterByCategory from "../components/FilterByCategory";
import ProductItem from "../components/ProductItem";
import { EnumKeys, ObjectKeysFromEnum, Product } from "../models/productModel";
import './ProductsPage.css';
import { Outlet, useLoaderData, useNavigate, useParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import { useChangeLocationListener } from "../hooks/useChangeLocationListener";

export type FilterOperation = "eq" | "lt" | "le" | "gt" | "ge" | "in" | "bw";
export type FilterData = ObjectKeysFromEnum<Product, {operation: FilterOperation, values: string[] | number[]}>

interface ProductPageProps {
    products: Product[];
    /* lifted-up properties to App */
    onAdd: (productId: number | string) => void;
    onRemove: (productId: number | string) => void;
    acceptPage: (page: number, perPage?: number) => void;
    currentPage: number;
    perPage: number;
    productsCount: number;
    loadingProducts: boolean;
}

function ProductsPage(props: ProductPageProps) {
    const params = useParams();
    const navigate = useNavigate();
    useChangeLocationListener(() => {window.scrollTo(0,0); /*console.log('scrollY', window.scrollY)*/});

    const products = props.products;
    /* add to cart and remove from cart */
    const onAdd = props.onAdd;
    const onRemove = props.onRemove;
    // accept page in App
    const acceptPage = props.acceptPage;
    // accept page and perPage data from router's route loader
    const loaderData = useLoaderData() as {page: number, perPage: number};
    // send page and perPage data from route loader to App automatically 
    useEffect(() => {
        acceptPage(loaderData.page, loaderData.perPage);
    }, [loaderData.page, loaderData.perPage, acceptPage])

/* client-side filtering - in web browser - and update products page */
const [filter, setFilter] = useState<FilterData | undefined>(undefined); // client-side filter of a product page
const [maxPrice, setMaxPrice] = useState(50); // maxPrice to be included into a corresponding filter item
const [filteredProducts, setFilteredProducts] = useState([]/*products*/); // products that are filtered to be displayed on products page
const [selectedCat, setSelectedCat] = useState(''); // selected category for filter - to mark it in FilterByCategory component
    // callback on max price range change
const handleRangeChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value;
    setMaxPrice(Number(val));
    // addFilter here instead of a separate useEffects, because maxPrice is expected to be changed only here, and addFilter is used from within FilterByCategories comp.
    addFilter("price", {operation: "le", values: [Number(val)]}); // val umesto maxPrice, jer ne stize da azurira interfejs prema novom maxPrice
}
// handle selectedCat change
const handleCatChange = ( categ: string) => {
    setSelectedCat(categ);
    if (params.productId) {
        navigate('/products');
        //history.back();
    }
}
// add new item into filter - all filter items should be true on a specific product item to be filtered and displayed
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
// remove filter item (regarding one of a product property) from filter
const removeFromFilter = (prodProp: EnumKeys<Product>) => {
    let filtNew : FilterData | undefined;
    if (filter !== undefined ) {
        filtNew = { ...filter };
        delete filtNew[prodProp];
    }
    setFilter(filtNew);
}
// automatically set filtered products according to (changes in) products on page and filter data
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
    }) as never[])
}, [products, filter]);
/* end - client-side products filter */
    
    return (
        <div id="products-page">
            <FilterByCategory products={products} direction="row" addToFilter={addFilter} removeFromFilter={removeFromFilter} selectedCat={selectedCat} setSelectedCat={handleCatChange}/>
            <Outlet />
            {!params.productId && (<div id="product-items">
                <div id="price-filter">
                    <div id="vert-fbc">
                        <FilterByCategory products={products} direction="column" addToFilter={addFilter} removeFromFilter={removeFromFilter} selectedCat={selectedCat} setSelectedCat={handleCatChange}/>
                    </div>
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
                <div id="items">
                    <Pagination currentPage={props.currentPage} perPage={props.perPage} pageBaseUrl="/products" numMiddle={3} paramType={"search"} recordCount={props.productsCount}/>
                    <div id="products-grid">
                        {props.loadingProducts ? <p>Loading products, please wait...</p> : (filteredProducts.length > 0 ? filteredProducts.map((product) => (
                            <div key={(product as Product).productid} style={{padding: "1vh 0.2vw"}}><ProductItem product={product} onAdd={onAdd} onRemove={onRemove}/></div>
                        )) : <span style={{color: 'black'}}>No products matching your criteria.</span>)}
                    </div>
                    <Pagination currentPage={props.currentPage} perPage={props.perPage} pageBaseUrl="/products" numMiddle={3} paramType={"search"} recordCount={props.productsCount}/>
                </div>
                
            </div>)}
        </div>
    )
}

export default ProductsPage
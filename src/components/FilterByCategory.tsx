import { MdMenu } from 'react-icons/md';
import { EnumKeys, Product } from '../models/productModel';
import './FilterByCategory.css'
import { useEffect, useState } from 'react';
import { FilterOperation } from '../pages/ProductsPage';

interface FilterByCategoryProps {
    products: Product[];
    direction: React.CSSProperties["flexDirection"];
    addToFilter: (prodProp: EnumKeys<Product>, prod: {operation: FilterOperation, values: string[] | number[]}) => void;
    removeFromFilter: (prodProp: EnumKeys<Product>) => void;
    selectedCat: string;
    setSelectedCat: (categ: string) => void;
}

const FilterByCategory: React.FC<FilterByCategoryProps> = ({products, direction, addToFilter, removeFromFilter, selectedCat, setSelectedCat}) => {

    // update automatically list of categories from products array
    const [uniqueCategories, setUniqueCategories] = useState<(string | undefined)[]>([]);
    useEffect(() => {
        const allC = products.map((prod) => {
            return prod.category;
        })
        const uc = allC.filter((v, i, arr) => {
            return i == arr.indexOf(v);
        }); // unique categories remain only
        setUniqueCategories(uc);
    }, [products])

    return (
        <div className="by-categories" style={{flexDirection: direction, backgroundColor: direction === 'column' ? "transparent" : "#BBA99A"}}>
            {direction !== 'column' && <div className={ selectedCat === '' ? 'selectedCat' : undefined} onClick={() => {removeFromFilter('category'); setSelectedCat('');}}><MdMenu/></div>}
            {uniqueCategories.map((categ) => (
                <div key={categ || 'nullKey'} className={ selectedCat === categ ? 'selectedCat' : undefined} onClick={() => {addToFilter("category", {operation: "eq", values: [categ as string]}); setSelectedCat(categ as string);}}>{categ}</div>
            ))}
        </div>
    )
}

export default FilterByCategory
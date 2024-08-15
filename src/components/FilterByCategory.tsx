import { MdMenu } from 'react-icons/md';
import { Product } from '../models/productModel';
import './FilterByCategory.css'
import { useEffect, useState } from 'react';

interface FilterByCategoryProps {
    products: Product[];
    direction: React.CSSProperties["flexDirection"];
}

const FilterByCategory: React.FC<FilterByCategoryProps> = ({products, direction}) => {

    // to be responsive on changes in categories
    const [uniqueCategories, setUniqueCategories] = useState<(string | undefined)[]>([]);
    useEffect(() => {
        const allC = products.map((prod) => {
            return prod.category;
        })
        const uc = allC.filter((v, i, arr) => {
            return i == arr.indexOf(v);
        });
        setUniqueCategories(uc);
    }, [products])

    return (
        <div className="by-categories" style={{flexDirection: direction, backgroundColor: direction === 'column' ? "transparent" : "#BBA99A"}}>
            {direction !== 'column' && <div><MdMenu/></div>}
            {uniqueCategories.map((categ) => (
                <div key={categ}>{categ}</div>
            ))}
        </div>
    )
}

export default FilterByCategory
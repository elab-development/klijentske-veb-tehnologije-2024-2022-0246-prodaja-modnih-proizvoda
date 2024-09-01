import { useEffect/*, useState*/ } from "react";
import { useParams } from "react-router-dom"
import { Product } from "../models/productModel";
//import { Product } from "../models/productModel";

interface ProductPageProps {
    acceptProductCode: (code: number | string) => void;
    loadingProduct: boolean;
    product: Product;
    apiRequestsRemaining: number;
}

const ProductPage = ({acceptProductCode, loadingProduct, product, apiRequestsRemaining}: ProductPageProps) => {
    const params = useParams();

    //const [product, setProduct] = useState<Product | undefined>(undefined);

    useEffect(() => acceptProductCode(params.productId as string), [params.productId, acceptProductCode]);
    //useEffect(() => acceptPage(loaderData.page, loaderData.perPage), [loaderData.page, loaderData.perPage, acceptPage]);
    
    return (
        <div style={{color: 'black'}}>{loadingProduct ? (<p>Loading product {params.productId} data, please wait...</p>) : (
            <div>
                <p>{JSON.stringify(product)}</p>
                <p>API requests remaining (this month): {apiRequestsRemaining}</p>
            </div>
        )}</div>
    )
}

export default ProductPage
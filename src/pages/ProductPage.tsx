import { useEffect/*, useState*/ } from "react";
import { useParams } from "react-router-dom"
//import { Product } from "../models/productModel";

interface ProductPageProps {
    fetchData: (url: string, callback: (data: unknown) => void, onErr: (e: unknown) => void, options: object ) =>  void;
    loadingProduct: boolean;
}

const ProductPage = ({fetchData, loadingProduct}: ProductPageProps) => {
    const params = useParams();
    const productId = params.productId;
    //const [product, setProduct] = useState<Product | undefined>(undefined);

    const processProductDetails = () => {};

    useEffect(() => {
        const url = 'https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/detail?lang=en&country=us&productcode=0839915011';
        const options = {
        method: 'GET',
            headers: {
                'x-rapidapi-key': '42a9fe9fa2msh8eaebbf9ccf1c57p13e6c1jsn588ebcc3a584',
                'x-rapidapi-host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
            }
        };
        fetchData(url, processProductDetails, (e) => e, options);
    })
    
    return (
        <div style={{color: 'black'}}>{loadingProduct ? (<p>Loading product {productId} data, please wait...</p>) : (
            <div>

            </div>
        )}</div>
    )
}

export default ProductPage
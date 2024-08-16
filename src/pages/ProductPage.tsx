import { useParams } from "react-router-dom"

const ProductPage = () => {
    const params = useParams();
    
    return (
        <div>{params.productId}</div>
    )
}

export default ProductPage
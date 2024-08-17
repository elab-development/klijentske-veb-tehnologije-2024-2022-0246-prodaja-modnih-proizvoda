import { MdProductionQuantityLimits, MdRemoveShoppingCart, MdSaveAlt, MdShoppingCartCheckout } from 'react-icons/md';
import { Product, Size } from '../models/productModel';
import './CartItem.css'
import { useEffect, useState } from 'react';

interface CartItemProps {
    item: Product;
    new: boolean;
    saveNewItem: (numOfItems: number, size: Size, item?: Product) => void;
    removeProductFromCart: (productid: number) => void;
    removeSizeFromCart: (productid: number, size: Size) => void;
}

const CartItem = (props: CartItemProps) => {
    const newItem = props.new;
    const [sizeOnNew, setSizeOnNew] = useState<Size | "0">("0");
    const [amount, setAmount] = useState(1);
    const [item, setItem] = useState<Product>(props.item);
    
    // callback to handle number of purchased product items of the size specified in the corresponding field for new item in the cart
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        //const name = ev.target.name;
        const value = ev.target.value;

        if (newItem) {
            setItem(() => ({...item, amounts: {...item.amounts, [sizeOnNew as string]: Number(value)}}));
            setAmount(Number(value));
        } else {
        // nothing for now
        }
    }

    const handleSelect = (ev: React.ChangeEvent<HTMLSelectElement>)  => {
        const value = ev.target.value;
        if (value === "0") {setSizeOnNew("0");} else {setSizeOnNew(value as Size | "0");}
    }

    useEffect(() => {
        setItem(props.item);
    }, [props.item])

    return (
        <>
            <div className="cart-item-image"><div style={{backgroundImage: `url("/img/products/${item.image}")`}}></div></div>
            <div className="cart-item-data">
                <h3 style={{textAlign: 'center'}}>
                    {newItem && <MdShoppingCartCheckout style={{fontSize: '25pt'}} />} { (newItem ? <span> New cart item - please select size: <select onChange={handleSelect} value={sizeOnNew}>
                        <option value={0}>Select size...</option>
                        {Object.keys(item.amounts).map((size) => (<option value={size} key={size}>{size}</option>))}
                        </select></span> : '') } <br /> { item.name }
                </h3>
                {(sizeOnNew !== '0' || !newItem) && <><div className="cart-item-data-header">
                    <div style={{flexGrow: "1", textAlign: "left"}}># of items</div><div style={{textAlign: "center"}}>Size:</div><div style={{textAlign: "center"}}>Price:</div>
                    { !newItem && <div><MdRemoveShoppingCart /></div>}
                </div>
                <div className="cart-items-by-sizes" style={newItem ? {flexDirection: "row"} : {}}>
                {( newItem ) ? (
                    <>
                        <div style={{flexGrow: "1", textAlign: 'left'}}><input type="number" value={amount || ""} onChange={handleChange}/></div>
                        <div>{sizeOnNew === "0" ? "" : sizeOnNew}</div>
                        <div><span>$ {item.price}</span></div>
                    </>
                ) : <>{ Object.keys(item.amounts).filter((size) => Number(item.amounts[size]) > 0).map((size) => (<div key={size} className='cart-items'>
                        <div><span>{item.amounts[size]}</span></div>
                        <div style={{textAlign: 'center'}}><span>{size}</span></div>
                        <div style={{textAlign: 'center'}}><span>$ {item.price}</span></div>
                        <div style={{textAlign: 'center'}}>
                            <button onClick={() => props.removeSizeFromCart(item.productid, size as Size)} title='Remove size from cart'><MdRemoveShoppingCart /></button>
                        </div>
                    </div>))}
                    </>
                }
                </div></>}
                {
                    newItem && (sizeOnNew !== "0") && (<div className='new-item-save'>
                        <button onClick={() => {props.saveNewItem(amount, sizeOnNew as Size)}} disabled={amount<1}>
                            <MdSaveAlt /> Save
                        </button>
                    </div>
                    )
                }
                {
                    !newItem && (<div className='new-item-save'>
                        <button onClick={() => {props.removeProductFromCart(item.productid)}} disabled={amount<1}>
                        <MdProductionQuantityLimits /> Remove
                        </button>
                    </div>)
                }
            </div>
        </>
    )
}

export default CartItem

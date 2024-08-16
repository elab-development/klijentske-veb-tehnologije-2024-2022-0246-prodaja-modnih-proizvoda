import { MdProductionQuantityLimits, MdSaveAlt, MdShoppingCartCheckout } from 'react-icons/md';
import { Product, Size } from '../models/productModel';
import './CartItem.css'
import { useState } from 'react';

interface CartItemProps {
    item: Product;
    new: boolean;
    saveNewItem: (numOfItems: number, size: Size) => void;
    removeProductFromCart: (productid: number) => void;
}

const CartItem = (props: CartItemProps) => {
    const newItem = props.new;
    const [sizeOnNew, setSizeOnNew] = useState<Size | "0">("0");
    const [amount, setAmount] = useState(1);
    const [item, setItem] = useState<Product>(props.item);
    
    const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        //const name = ev.target.name;
        const value = ev.target.value;
        if (newItem) {
            setItem(() => ({...item, amounts: {...item.amounts, [sizeOnNew as string]: Number(value)}}));
            setAmount(Number(value));
        } else {
//
        }
    }

    const handleSelect = (ev: React.ChangeEvent<HTMLSelectElement>)  => {
        const value = ev.target.value;
        if (value === "0") {setSizeOnNew("0");console.log('select', sizeOnNew)} else {setSizeOnNew(value as Size | "0");}
    }

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
                    <div style={{flexGrow: "1"}}># of items</div><div style={{flexBasis: "content"}}>Size:</div><div style={{flexBasis: "content"}}>Price:</div>
                </div>
                <div className="cart-items-by-sizes">
                {( newItem ) ? (
                    <>
                        <div style={{flexGrow: "1"}}><input type="number" value={amount || ""} onChange={handleChange}/></div>
                        <div style={{flexBasis: "content",textAlign: 'center'}}>{sizeOnNew === "0" ? "" : sizeOnNew}</div>
                        <div style={{flexBasis: "content"}}><span>$ {item.price}</span></div>
                    </>
                ) : <>{ Object.keys(item.amounts).filter((size) => Number(item.amounts[size]) > 0).map((size) => (<div key={size} className='cart-items'>
                        <div><input type="number" value={item.amounts[size]} onChange={handleChange}/></div>
                        <div><span>{size}</span></div>
                        <div><span>$ {item.price}</span></div>
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
import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { Product, Size } from "../models/productModel";

import './Cart.css'
import { useNavigate } from "react-router-dom";
import { MdCancelScheduleSend } from "react-icons/md";

interface CartProps {
    cartProducts: Product[];
    newItemInCart: Product | null;
    initNewCartItemSize: Size | null;
    processPromo: (promo: string) => void;
    savingsObj: Savings;
    saveNewItem: (numOfItems: number, size: Size) => void;
    removeProductFromCart: (productId: number | string) => void;
    removeSizeFromCart: (productId: number | string, size: Size) => void;
    removePromoCode: () => void;
}

export interface Savings {
    amount: number;
    calculation: 'percent' | 'difference';
    name?: 'string';
}

function Cart(props: CartProps) {
    const cartItems = props.cartProducts; // products in the cart
    const initNewCartItemSize = props.initNewCartItemSize;
    const [cartItemsCount, setCartItemsCount] = useState(0); // number of product items of all sizes in the cart
    const [cartItemsPrice, setCartItemsPrice] = useState(0); // total price of purchased items in the cart
    const [promoCode, setPromoCode] = useState(''); // promo code applied (previously approved by server)
    const [savings, setSavings] = useState(0); // saving amount in $, applied by accepted promo code
    const newItem = props.newItemInCart; // new item in the cart that should be filled with the product size and number of items to be purchased - before will be saved in cart
    const savingsObj = props.savingsObj; // savings object received from server for approved promo code
    const navigate = useNavigate();
    // (re)calculate automatically the aggregate (summary) for updated cart items and update user interface
    useEffect(() => {
        //console.log('cartItems: ', cartItems);
        let countOfItems = 0;
        let priceOfItems = 0;
        cartItems.forEach((val) => {
            countOfItems += val.countOfItems();
            priceOfItems += val.countOfItems() * val.price;
        });
        setCartItemsCount(countOfItems);
        setCartItemsPrice(priceOfItems); 
    }, [cartItems]);
    // recalculate price (and update user interface) of all purchased items on promo code approvement (and savings object reception)
    useEffect(() => {
        calculateSavings(cartItemsPrice, savingsObj);
    }, [cartItemsPrice, savingsObj]);
    // callback on changed promo code by user
    const handlePromoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        setPromoCode(val);
    }
    // calculate saving amount in $ according to savings object, received from server
    const calculateSavings = (price: number, savingsObj: Savings) => {
        const amount = savingsObj.amount;
        const calc = savingsObj.calculation;
        switch (calc) {
        case 'percent':
            setSavings(price * amount / 100);
            break;
        case 'difference':
            setSavings(amount);
            break;
        default:
            setSavings(0);
        }
    }

    return (
        <div id="cart">
            { newItem && <div id="new-cart-item">
                <CartItem new item={newItem} saveNewItem={props.saveNewItem} removeProductFromCart={props.removeProductFromCart}
                    removeSizeFromCart={props.removeSizeFromCart} initNewCartItemSize={initNewCartItemSize} />
            </div> }
            <div id="cart-items">
                {cartItems.length ? (<div id="cart-items-saved"><div>
                    {cartItems.map((item) => (
                        <div key={item.productid} className="cart-item">
                            <CartItem new={false} item={item} saveNewItem={props.saveNewItem}
                                removeProductFromCart={props.removeProductFromCart} removeSizeFromCart={props.removeSizeFromCart} initNewCartItemSize={null} />
                        </div>
                    ))}
                </div></div>): (<p style={{textAlign: 'center'}}>No items in the cart.</p>)}
                { cartItems.length.toString() !== '0' && <div id="cart-summary"><div>
                    <h3 style={{padding: '0 2vw'}}>Order summary</h3>
                    <div className="cart-summary-item">
                        <span>{cartItemsCount} item{cartItemsCount>1 ? 's' : ''}</span>
                        <span>$ {cartItemsPrice.toFixed(2)}</span>
                    </div>
                    <div className="cart-summary-item">
                        <span>Savings</span>
                        <span>$ {savings.toFixed(2)}</span>
                    </div>
                    <div className="cart-summary-item">
                        <span>Total</span>
                        <span>$ {(cartItemsPrice- savings).toFixed(2)}</span>
                    </div>
                    <div style={{textAlign: 'center', padding: '2vh 2vw'}}>
                        <input placeholder="Enter promo code"
                            style={{padding: "1.3vh 1vw", width: 'fit-content', border: '1px solid #A58B77', borderRadius: '10px'}}
                            value={promoCode} onChange={handlePromoChange}
                        />
                        <button
                            style={{ marginLeft: '1.5vh'}}
                            onClick={() => props.processPromo(promoCode)}>Apply</button>
                    </div>
                    { savingsObj.amount > 0 && <div style={{textAlign: 'center'}}> 
                        <span style={{color: '#A58B77'}}>{savingsObj.name} promo code applied! </span><button onClick={() => props.removePromoCode()}><MdCancelScheduleSend /> Remove</button>
                    </div> }
                    <div style={{textAlign: 'center', padding: '1vh 2vw'}}>
                        <div style={{paddingRight: "1vw", width: '70%', display: "inline-block"}}>
                            <button style={{ width: '100%'}} onClick={() => navigate('/payment')}>Continue</button>
                        </div>
                        <div style={{paddingLeft: "1vw", width: '30%', display: "inline-block"}}>
                            <button style={{ width: '100%'}} onClick={() => history.back()}>Back</button>
                        </div>
                    </div>
                </div></div> }
            </div>
        </div>
    )
}

export default Cart
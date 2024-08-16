import { useEffect, useState } from "react";
import CartItem from "../components/CartItem";
import { Product, Size } from "../models/productModel";

import './Cart.css'
import { useNavigate } from "react-router-dom";
import { MdCancelScheduleSend } from "react-icons/md";

interface CartProps {
    cartProducts: Product[];
    newItemInCart: Product | null;
    processPromo: (promo: string) => void;
    savingsObj: Savings;
    saveNewItem: (numOfItems: number, size: Size) => void;
    removeProductFromCart: (productId: number) => void;
    removePromoCode: () => void;
}

export interface Savings {
    amount: number;
    calculation: 'percent' | 'difference';
    name?: 'string';
}

function Cart(props: CartProps) {
    const cartItems = props.cartProducts;
    const [cartItemsCount, setCartItemsCount] = useState(0);
    const [cartItemsPrice, setCartItemsPrice] = useState(0);
    const [promoCode, setPromoCode] = useState('');
    const [savings, setSavings] = useState(0);
    const newItem = props.newItemInCart;

    const savingsObj = props.savingsObj;

    const navigate = useNavigate();

    useEffect(() => {
        let countOfItems = 0;
        let priceOfItems = 0;
        cartItems.forEach((val) => {
            countOfItems += val.countOfItems();
            priceOfItems += val.countOfItems() * val.price;
        });
        setCartItemsCount(countOfItems);
        setCartItemsPrice(priceOfItems); 
    }, [cartItems]);

    useEffect(() => {
        calculateSavings(cartItemsPrice, savingsObj);
    }, [cartItemsPrice, savingsObj]);

    const handlePromoChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        const val = ev.target.value;
        setPromoCode(val);
    }

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
        //console.log('savings', savings, 'savingsObj', savingsObj);
    }

    return (
        <div id="cart">
            { newItem && <div id="new-cart-item">
                <CartItem new item={newItem} saveNewItem={props.saveNewItem} removeProductFromCart={props.removeProductFromCart} />
            </div> }
            <div id="cart-items">
                {cartItems.length ? (<div id="cart-items-saved"><div>
                    {cartItems.map((item) => (
                        <div key={item.productid} className="cart-item">
                            <CartItem new={false} item={item} saveNewItem={props.saveNewItem} removeProductFromCart={props.removeProductFromCart} />
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
                        <button style={{ width: '100%'}} onClick={() => navigate('/payment')}>Continue</button>
                    </div>
                </div></div> }
            </div>
        </div>
    )
}

export default Cart
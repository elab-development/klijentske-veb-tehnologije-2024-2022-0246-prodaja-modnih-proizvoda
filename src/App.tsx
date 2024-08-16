import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import Layout from './pages/Layout'
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import Cart from './pages/Cart'
import type { Savings } from './pages/Cart';
import ProductsPage from './pages/ProductsPage'
import { useEffect, useState } from 'react'
import { User } from './models/userModel'
import { Product, Size } from './models/productModel'
import Login from './pages/Login'
import ProductPage from './pages/ProductPage'

function App() {
  // variables lifted up from child components
  const [user, setUser] = useState<User | Record<string, never>>({firstName: "Site", lastName: "User"})

  const noSavings: Savings = {amount: 0, calculation: 'difference'};
  const [cartNum, setCartNum] = useState(0);
  const [savings, setSavings] = useState<Savings>(noSavings /*0*/);
  const [cartProducts, setCartProducts] = useState<Product[]>([]);
  const [newItemInCart, setNewItemInCart] = useState<Product | null>(null);
  
  const [products, setProducts] = useState<Product[]>([]);

  const loginUser = async (email: string | undefined, password: string | undefined) => {
    try {
      if (email && password) { // mock log in
        const response = await fetch(`/data/${email}|${password}.json`);
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setUser(json);
      } else { // mock log out
        setUser({firstName: "Site", lastName: "User"});
      }
    } catch (error: unknown) {
      const err = error as Error;
      alert('No matched user and password. Please try again. ' + err.message);
    }
  };

  useEffect(() => {
      //server session should be checked - AS IF IT WERE DONE and user data is obtained upon successfull login
      
      
  }, [])

  // fetch data - generic
  const fetchData = async (url: string, callback: (data: unknown) => void, onErr: (e: unknown) => void = (err) => err) => {
    try {
      const response = await fetch(url)
      const data = await response.json()
      console.log('data: ', data)
      callback(data as {products: Product[]})
    } catch(e) {
      onErr(e)
    }
  }

  // callback for products processing
  const afterFetchProducts = (data: {products: Product[]}) => {
    setProducts(data.products.map((el: unknown) => {
      const elem = el as Product;
      return new Product(elem.productid, elem.name, elem.description, elem.price, elem.image, elem.category, elem.recommended);
  }));
  }
  
  // apply fetch products
  useEffect(() => {
      fetchData('/data/products.json', afterFetchProducts as unknown as (data: unknown) => void);
  },[])

  // corellate cart items with products
  useEffect(() => {
    const cartItems = products.filter((product) => {
      let takeIt = false;
      Object.keys(product.amounts).forEach((size) => {
        if (product.amounts[size] > 0) {takeIt = true;}
      })
      return takeIt;
    });
    setCartProducts(cartItems);
    setCartNum(cartItems.length);
  }, [products])

  const addToCart = (productId: number, amount = 1, size: Size | null = null) => {
    const pInd = products.findIndex((val) => val.productid === productId);
    if (!size) { // nova stavka u korpi
      setNewItemInCart(products[pInd]);
    } else {
      products[pInd].addToCart(amount, size);
      setNewItemInCart(null); // da li ovako drasticno?
    }
  }

  // remove all sizes of product from cart
  const removeProductFromCart = (productId: number) => {
    const prItems: Product[] = [...products];
    const pInd = prItems.findIndex((val) => val.productid === productId);
    Object.keys(prItems[pInd].amounts).forEach((size) => {
      prItems[pInd].updateAmount(size as Size, 0);
    });
    setProducts(prItems);
  }

  const saveNewItem = (numOfItems: number, size: Size) => {
    // save new item to cart
    const pInd = products.findIndex((val) => val.productid === newItemInCart?.productid);
    const procopy = [...products];
    procopy[pInd].addToCart(numOfItems, size);
    setProducts(procopy);
    setNewItemInCart(null);
    console.log('products: ', products, 'cart items:', cartProducts);
  }

  const onPromoResponse = (data: unknown) => {
    const savingsObj: Savings = (data as {savings: Savings}).savings;
    setSavings(savingsObj);
  }
  
  const onNoPromo = (e: unknown) => {
    const er = (e as Error).message;
    alert (`Promo code is not valid - ${er}`);
  }  

  const applyPromoCode = (promo: string) => {
      // simulate server response
      fetchData(`/data/promo_kod_${promo}.json`, onPromoResponse, onNoPromo);
  }

  const removePromoCode = () => {
    setSavings(noSavings);
  }


  /* obtain products data needed on home and products pages */
  useEffect(() => {
      //const {data} = useFetch('/data/products.json')
      const fetchData = async () => {
        const response = await fetch('/data/products.json')
        const data = await response.json()
        console.log('data: ', data)
        setProducts(data.products.map((el: unknown) => {
          const elem = el as Product
          return new Product(elem.productid, elem.name, elem.description, elem.price, elem.image, elem.category, elem.recommended)
        }))
      }
      fetchData()
  },[])
      
  /* router-enabled application skeleton: index marks default subpage loaded into the Layout page's Outlet router component for home page on path name / */
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<Layout user={user} loginUser={loginUser} cartItemsCount={cartNum}/>}>
        <Route index element={<Home products={products}/>} />
        <Route path="/products/:productId" element={<ProductPage></ProductPage>} />
        <Route path="/products" element={<ProductsPage products={products} onAdd={addToCart} onRemove={removeProductFromCart}/>} />
        <Route
          path="/cart"
          element={
            <Cart
              cartProducts={cartProducts} newItemInCart={newItemInCart} saveNewItem={saveNewItem} removeProductFromCart={removeProductFromCart}
              processPromo={applyPromoCode} savingsObj={savings} removePromoCode={removePromoCode} />
          } />
        <Route path="/login" element={<Login loginUser={loginUser}/>} />
        <Route path="*" element={<NoPage />} />
      </Route>
    ])
  )

  return (
    <RouterProvider router={router} fallbackElement={<p>Loading...</p>} />
  )
}

export default App

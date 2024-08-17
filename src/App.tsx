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
  // user
  const [user, setUser] = useState<User | Record<string, never>>({firstName: "Site", lastName: "User"})
  // cart
  const noSavings: Savings = {amount: 0, calculation: 'difference'};
  const [cartNum, setCartNum] = useState(0); // number of products in the cart - not specific items of all sizes!
  const [savings, setSavings] = useState<Savings>(noSavings /*0*/);
  const [cartProducts, setCartProducts] = useState<Product[]>([]); // products in the cart
  const [newItemInCart, setNewItemInCart] = useState<Product | null>(null);
  const [newAlreadyInCart, setNewAlreadyInCart] = useState(-1); // to have info in time - when shown in the cart - about if a new cart item product is already in the cart
  // products
  const [products, setProducts] = useState<Product[]>([]); // products from one page, obtained from server
  const [productsCount, setProductsCount] = useState(0); // total number of products in the store - in order to calculate max number of pages
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(16);

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
      callback(data as {products: Product[]})
    } catch(e) {
      onErr(e)
    }
  }
  // callback to accept page changes (from current url - originating from paginator)
  const acceptPageChange = (page: number, perPage?: number ) => {
    setPage(page);
    if (perPage) {
      setPerPage(perPage);
    }
  }
  // processing products on page from server
  useEffect(() => {
    const afterFetchProducts = (data: {products: Product[], count: number}) => {
      const productsFromData = data.products.map((el: unknown) => {
        const elem = el as Product;
        return new Product(elem.productid, elem.name, elem.description, elem.price, elem.image, elem.category, elem.recommended);
      });
      setProducts(productsFromData as Product[]);
      setProductsCount(data.count);
    };
    fetchData(`/data/products_per_page_${perPage}_${page}.json`,afterFetchProducts as unknown as (data: unknown) => void);
  }, [page, perPage])
  // determine automatically if new product item is already in the cart (when cartProducts and / or newItemInCart variables have changed)
  useEffect(() => {
    const indInCart = cartProducts.findIndex((product) => product.productid === newItemInCart?.productid);
    setNewAlreadyInCart(indInCart);
  },[newItemInCart, cartProducts])
  // determine automatically count of products in the cart (when cartProducts variable has changed)
  useEffect(() => {
    setCartNum(cartProducts.length);
  }, [cartProducts])
  // add product as new item to (specify amount and size and) be saved in the cart 
  const addToCart = (productId: number, amount = 1, size: Size | null = null) => {
    const cInd = cartProducts.findIndex((val) => val.productid === productId);
    if (size == null) { // new item in cart
      if (cInd === -1) {
        const pInd = products.findIndex((val) => val.productid === productId);
        setNewItemInCart(products[pInd]);
      } else {
        setNewItemInCart(cartProducts[cInd]);
      }
    } else { // not used
      //products[pInd].addToCart(amount, size);
      const pInd = products.findIndex((val) => val.productid === productId);
      saveNewItem(amount,size,products[pInd]);
      //setNewItemInCart(null);
    }
  }
  // removes all sizes of a product from cart
  const removeProductFromCart = (productId: number) => {
    const cartItems: Product[] = [...cartProducts];
    if (cartItems.length) {
      const cInd = cartItems.findIndex((val) => val.productid === productId);
      if (cInd > -1) {
        cartItems.splice(cInd, 1);
        setCartProducts(cartItems);
        //setCartNum(cartItems.length);
        // delete cart data in corresponding product - just in case, if any reference has left to products and not to cartProducts
        const pInd = products.findIndex((val) => val.productid === productId);
        if (pInd > -1) {
          products[pInd].removeFromCartAllSizes();
        }
      }
    }
  }
  // removes one size of a product from cart
  const removeSizeFromCart = (productId: number, size: Size) => {
    const cartItems: Product[] = [...cartProducts];
    if (cartItems.length) {
      const cInd = cartItems.findIndex((val) => val.productid === productId);
      if (cInd > -1) {
        cartItems[cInd].updateAmount(size, 0);
        if (cartItems[cInd].countOfItems() === 0) { // no more this product in cart - remove cart item
          cartItems.splice(cInd, 1);
        }
        setCartProducts(cartItems);
        // ... and count of products in cart changes automatically
      }
    }
  }
  // saves a new item to cart
  const saveNewItem = (numOfItems: number, size: Size, prodForCart: Product = newItemInCart as Product) => {
    console.log('newAlreadyInCart', newAlreadyInCart);
    if (newAlreadyInCart === -1) {
      prodForCart.addToCart(numOfItems, size); // update amount of specified size for selected product item
      setCartProducts(() => [...cartProducts, prodForCart]);
      // setCartNum(cartProducts.length + 1); changes automatically
    } else {
      cartProducts[newAlreadyInCart].addToCart(numOfItems, size);
      setCartProducts(() => [...cartProducts]); // no change in length
      //setCartNum(cartProds.length); changes automatically
    }
    setNewItemInCart(null);
    console.log('products: ', products, 'cart items:', cartProducts);
  }
  // callback when the server response about user's promo code submission arrives
  const onPromoResponse = (data: unknown) => {
    const savingsObj: Savings = (data as {savings: Savings}).savings;
    setSavings(savingsObj);
  }
  // error callback when a user's promo code submitted is not recognized on server
  const onNoPromo = (e: unknown) => {
    const er = (e as Error).message;
    alert (`Promo code is not valid - ${er}`);
  }  
  // send a user's promo code to validation on server
  const applyPromoCode = (promo: string) => {
      // simulate server response
      fetchData(`/data/promo_kod_${promo}.json`, onPromoResponse, onNoPromo);
  }
  // remove a promo code by user
  const removePromoCode = () => {
    setSavings(noSavings);
  }
  
  /* router-enabled application skeleton: index marks default subpage loaded into the Layout page's Outlet router component for home page on path name / */
  const router = createBrowserRouter(
    createRoutesFromElements([
      <Route path="/" element={<Layout user={user} loginUser={loginUser} cartItemsCount={cartNum}/>}>
        <Route index element={<Home products={products}/>} />
        <Route path="/products/:productId" element={<ProductPage></ProductPage>} />
        <Route path="/products" loader={({request}) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page')) || 1;
          const perPage = Number(url.searchParams.get('perPage')) || 16;
          return {page, perPage };
        }}
          element={ <ProductsPage products={products} onAdd={addToCart} onRemove={removeProductFromCart} acceptPage={acceptPageChange} productsCount={productsCount}
                      currentPage={page} perPage={perPage} /> }
        />
        <Route
          path="/cart"
          element={
            <Cart
              cartProducts={cartProducts} newItemInCart={newItemInCart} saveNewItem={saveNewItem}
              removeProductFromCart={removeProductFromCart} removeSizeFromCart={removeSizeFromCart}
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

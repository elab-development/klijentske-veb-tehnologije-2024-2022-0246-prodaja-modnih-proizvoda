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
import { ProductResult, ProductResults } from './models/productsData'
import apiCategories from './assets/api_categories.json'

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
  const [loadingProducts, setLoadingProducts] = useState(false);

  interface apiCategories {
    CatName?: string;
    CategoryValue?: string;
    tagCodes?: string[];
    CategoriesArray?: apiCategories[] | undefined;
  }
  
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
  const fetchData = async (url: string, callback: (data: unknown) => void, onErr: (e: unknown) => void = (err) => err, options: object = {}) => {
    try {
      setLoadingProducts(true)
      const response = await fetch(url, options)
      setLoadingProducts(false)
      const data = await response.json()
      callback(data)
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
    const getCategoryFromApi = (tag: string, obj: apiCategories, level = 1, separator = "_") => {
      if(!obj || obj.tagCodes?.includes(tag)) return obj;
      
      const catTags = tag.split(separator);
      let i = 0;
      let searchTxt = catTags[0] + separator + catTags[1];
      if (level > 1) searchTxt = tag;
      const res = obj.CategoriesArray;
      if (res) {
        while (!getCategoryFromApi(searchTxt, res[i]) && (i < res.length)) {i++;}
        if (i <= res.length) {
          return getCategoryFromApi(tag, getCategoryFromApi(searchTxt, res[i]) as apiCategories, 2, separator);
        } 
      } else {return null}
    };
    const url = `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=${page - 1}&pagesize=${perPage}&categories=ladies_all`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': '42a9fe9fa2msh8eaebbf9ccf1c57p13e6c1jsn588ebcc3a584',
        'x-rapidapi-host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
      }
    };

    const afterFetchProducts = (data: ProductResults) => {
      const productsFromData = data.results.map((el: unknown, index: number) => {
        const res = el as ProductResult;
        const elem = res.articles[0];
        //console.log(res.mainCategoryCode, getCategoryFromApi(res.mainCategoryCode));
        return new Product(elem.code, elem.name, `Description of ${elem.name}`, elem.whitePrice.value, elem.images[0].baseUrl, getCategoryFromApi(res.mainCategoryCode, apiCategories)?.CatName as string, index < 4 || res.sale);
      });
      setProducts(productsFromData as Product[]);
      setProductsCount(data.pagination.totalNumberOfResults);
    };
    fetchData(url,afterFetchProducts as unknown as (data: unknown) => void, (err) => err, options);

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
  const addToCart = (productId: number | string, amount = 1, size: Size | null = null) => {
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
  const removeProductFromCart = (productId: number | string) => {
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
  const removeSizeFromCart = (productId: number | string, size: Size) => {
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
        <Route index element={<Home products={products} onAdd={addToCart} onRemove={removeProductFromCart} loadingProducts={loadingProducts} />} />
        <Route path="/products" loader={({request}) => {
          const url = new URL(request.url);
          const page = Number(url.searchParams.get('page')) || 1;
          const perPage = Number(url.searchParams.get('perPage')) || 16;
          return {page, perPage };
        }}
          element={ <ProductsPage products={products} onAdd={addToCart} onRemove={removeProductFromCart} acceptPage={acceptPageChange} productsCount={productsCount}
                      currentPage={page} perPage={perPage} loadingProducts={loadingProducts} /> }
        >
          <Route path="/products/:productId" element={<ProductPage fetchData={fetchData} loadingProduct={loadingProducts}></ProductPage>} />
        </Route>
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

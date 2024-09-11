import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom"
import Layout from './pages/Layout'
import Home from './pages/Home'
import NoPage from './pages/NoPage'
import Cart from './pages/Cart'
import type { Savings } from './pages/Cart';
import ProductsPage from './pages/ProductsPage'
import { useDeferredValue, useEffect, useState } from 'react'
import { User } from './models/userModel'
import { Product, Size } from './models/productModel'
import Login from './pages/Login'
import ProductPage from './pages/ProductPage'
import { ProductDetailsResult, ProductResult, ProductResults } from './models/productsData'
import apiCategories from './assets/api_categories.json'

function App() {
  // saved in localStorage
  let cp = 1;
  let ci: Product[] = [];
  if (localStorage) {
    if (localStorage.getItem('lastPage')) {
      cp = Number(localStorage.getItem('lastPageViewed'));
    }
    if (localStorage.getItem('cartItems')) {
      const cio : Product[] = JSON.parse(localStorage.getItem('cartItems') as string);
      ci = cio.map((p) => new Product(p.productid, p.name, p.description, p.price, p.images, p.category, p.recommended, p.amounts ));
    }
  }
  // variables lifted up from child components
  // user
  const [user, setUser] = useState<User | Record<string, never>>({firstName: "Site", lastName: "User"})
  // cart
  const noSavings: Savings = {amount: 0, calculation: 'difference'};
  const [cartNum, setCartNum] = useState(0); // number of products in the cart - not specific items of all sizes!
  const [savings, setSavings] = useState<Savings>(noSavings /*0*/);
  const [cartProducts, setCartProducts] = useState<Product[]>(ci); // products in the cart
  const [newItemInCart, setNewItemInCart] = useState<Product | null>(null);
  const [newAlreadyInCart, setNewAlreadyInCart] = useState(-1); // to have info in time - when shown in the cart - about if a new cart item product is already in the cart
  const [initNewCartItemSize, setInitNewCartItemSize] = useState<Size | null>(null); // initial product size, taken from product page, for a new cart item on the cart 
  // products
  const [products, setProducts] = useState<Product[]>([]); // products from one page, obtained from server
  const [productsCount, setProductsCount] = useState(0); // total number of products in the store - in order to calculate max number of pages
  const [page, setPage] = useState(cp);
  const [perPage, setPerPage] = useState(16);
  const [loadingProducts, setLoadingProducts] = useState(false);
  // product data for product page
  const [product, setProduct] = useState<Product | undefined>(undefined);
  const [code, setCode] = useState<number | string | undefined>(undefined); // product code, ie. productId
  const [remainingApiRequests, setRemainingApiRequests] = useState(500);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const defferedProducts = useDeferredValue(products);
  const defferedCode = useDeferredValue(code);
  const defferedPage = useDeferredValue(page);

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
  const fetchData = async (url: string, callback: (data: unknown, headers: Headers) => void, onErr: (e: unknown) => void = (err) => err, options: object = {}) => {
    try {
      //setLoadingProducts(true)
      const response = await fetch(url, options)
      //setLoadingProducts(false)
      const data = await response.json()
      callback(data, response.headers)
    } catch(e) {
      onErr(e)
    }
  }

  // callback to accept productId changes
  const acceptProductCode = (pCode: number | string) => {
    setCode(pCode);
  }

  // callback to accept page changes (from current url - originating from paginator)
  const acceptPageChange = (page: number, perPage?: number ) => {
    setPage(page);
    localStorage.setItem('lastPageViewed', page.toString());
    if (perPage) {
      setPerPage(perPage);
    }
  }

  // processing product on productId changes
  useEffect(() => {
    let ignore = false; // to save API requests in development mode 
    // fetch product data by product code via API
    const fetchProduct = (pCode: string) => {
      if (!ignore && pCode) {
        const url = `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/detail?lang=en&country=us&productcode=${pCode}`;
        const options = {
          method: 'GET',
          headers: {
            'x-rapidapi-key': '85626f9ab9mshf18d6f11f90b5dap1b6e96jsn22e0ab356e24',
            'x-rapidapi-host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
          }
        };

        const afterFetchProduct = (data: ProductDetailsResult, headers: Headers) => {
          if (data.responseStatusCode === "ok") {
            const productDetails = data.product;
            const prod = products.find((el) => {
              return (el.productid === productDetails.code);
            });
            if (prod) {
              prod.description = productDetails.description;
              setProduct(prod as Product);
            } else {
              console.log('POZOR: Nema proizvoda!');
            }
            setRemainingApiRequests(Number(headers.get('X-Ratelimit-Requests-Remaining')));
          }
          
        };
        if ((defferedProducts[0].productid === products[0].productid) && (defferedCode !== code)) {
          setLoadingProduct(true);
          fetchData(url,afterFetchProduct as unknown as (data: unknown, headers: Headers) => void, (err) => err, options);
          setLoadingProduct(false);
        }
      }
    };
    fetchProduct(code as string);
    return () => {ignore = true};
  }, [code, products, defferedProducts, defferedCode]);

  // processing products on page from server
  useEffect(() => {
    let ignore = false; // to spare API requests in development mode 
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
        'x-rapidapi-key': '85626f9ab9mshf18d6f11f90b5dap1b6e96jsn22e0ab356e24',
        'x-rapidapi-host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
      }
    };

    const afterFetchProducts = (data: ProductResults) => {
      const productsFromData = data.results.map((el: unknown, index: number) => {
        const res = el as ProductResult;
        const elem = res.articles[0];
        //console.log(res.mainCategoryCode, getCategoryFromApi(res.mainCategoryCode));
        return new Product(elem.code, elem.name, `Description of ${elem.name}`, elem.whitePrice.value, elem.images.map((el) => el.baseUrl).concat(res.galleryImages.map((el) => el.baseUrl)), getCategoryFromApi(res.mainCategoryCode, apiCategories)?.CatName as string, index < 4 || res.sale);
      });
      setProducts(productsFromData as Product[]);
      setProductsCount(data.pagination.totalNumberOfResults);
    };
    if (!ignore && (!code || (defferedPage != page))) { // fetch sparingly regarding API requests
      setLoadingProducts(true);
      fetchData(url,afterFetchProducts as unknown as (data: unknown) => void, (err) => err, options);
      setLoadingProducts(false);
    }
    return () => {ignore = true;}
  }, [page, perPage, defferedPage, defferedCode, code])
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
  const addToCart = (productId: number | string/*, amount = 1*/, size: Size | null = null) => {
    if (size != null) { // new item in cart
      setInitNewCartItemSize(size);
    }
    const pInd = products.findIndex((val) => val.productid === productId);
    setNewItemInCart({...products[pInd]});
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
  // update localStorage for cart items
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartProducts));
  }, [cartProducts]);
  // remove value from initNewCartItemSize if this page has come from /cart
  useEffect(() => {
    if(document.referrer !== '') {
      const prevUrl = new URL(document.referrer);
      if (prevUrl.href.indexOf('/cart') > -1) {
        setInitNewCartItemSize(null);
      }
    }
  }, [setInitNewCartItemSize]);
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
    setInitNewCartItemSize(null);
    //console.log('products: ', products, 'cart items:', cartProducts);
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
          <Route path="/products/:productId"
            element={<ProductPage
                        acceptProductCode={acceptProductCode} loadingProduct={loadingProduct} product={product as Product}
                        addToCart={addToCart} apiRequestsRemaining={remainingApiRequests} products={products}
                        onRemove={removeProductFromCart}></ProductPage>} />
        </Route>
        <Route
          path="/cart"
          element={
            <Cart
              cartProducts={cartProducts} newItemInCart={newItemInCart} saveNewItem={saveNewItem}
              removeProductFromCart={removeProductFromCart} removeSizeFromCart={removeSizeFromCart}
              processPromo={applyPromoCode} savingsObj={savings} removePromoCode={removePromoCode} initNewCartItemSize={initNewCartItemSize} />
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

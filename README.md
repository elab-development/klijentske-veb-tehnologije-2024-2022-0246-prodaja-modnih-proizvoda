# KTeh2024: Prodaja modnih proizvoda - Fashion web store "Saška S. the Studio"

React + TypeScript + Vite web application

!["Saška S. the Studio" logo](public/img/logo.png)

The web store project "Saška S. - The Studio" should offer search and purchase of modern fashionable products for its users. With a wide selection of clothing and accessories, users can browse styles that suit their taste and needs. The appearance and assumed functionality of the application are in accordance with [the web page design project in the Figma web page prototype development environment](https://www.figma.com/design/a1a1F9hDzFrbcFIZcKoBRc/Prodavnica-modnih-proizvoda-domaci1) as part of Homework no. 1.

## Installation procedure

1. Clone application code from Github

```sh {"id":"01J859XFBD9VPC31ZDT3GFX8YF"}
git clone git@github.com:elab-development/klijentske-veb-tehnologije-2024-2022-0246-prodaja-modnih-proizvoda.git
```

2. Installation of dependencies

```sh {"id":"01J85A1WY8C2YP265F902DE7RE"}
npm install
```

3. Run the application in local development environment 

```sh {"id":"01J85A4FD12F9C5RWN3K94630F"}
npm run dev
```

4. Open application URL http://localhost:5173 in a browser

## Application options

As part of the React-router-based application skeleton with fixed **Header** and **Footer** components, the following pages are fully implemented as part of Homework no. 2 and seminar project requirements:

1. **Home page**, with a link to the products page, highlighted collection of fashionable products for beach and recommended products, filtered on client (browser) side from loaded products (mocked server response from .json file via fetch request)
2. **Login page**, according to design, with input fields for submiting user email and password to the server (with help of **useFormInput** custom React hook) and to obtain verified user data (mocked server response from .json file via fetch request)
3. **Products page**, showing fashionable products in cards (**ProductItem** component) within a 2D grid from a page of product data, selected within **Pagination** component (to list other product pages as well), that users can filter on client (browser) side on max price and a category selected out of automatically (reactively) generated list of all unique categories from loaded products (mocked server response from .json file via fetch request) within **FilterByCategory** component; each product card is a link to its details page and consists of product image and a row with price information, **Add to cart** and Favourites (‪‪❤︎‬ icon) buttons at bottom of the product image to push the selected product into cart (and redirecting to the *Cart* page); page number and products per page are obtained from URL search params via **loader** function as attribute of the corresponding **Route** component with path name **/products** and used with built-in hook **useLoaderData** in **ProductsPage** component; according to products per page and total number of records (products) obtained from server (from external API request to the **/list** endpoint of [HM - Hennes Mauritz fashion products API](https://rapidapi.com/apidojo/api/hm-hennes-mauritz/playground) exposed by [Rapid API](https://rapidapi.com) API provider and integrator), along with products page data), max number of pages is calculated within **Paginator** component, as well as what links to page numbers should be shown, also in terms of number of links to be shown around the current page (as **Paginator** component attribute); in **ProductsPage** the **useChangeLocationListener** custom hook is applied to scroll products page to top position on page load, implemented when router path location is changed
4. **Cart page** (with cart items being independent from products on page in the last version, so cart can collect product items from all pages) firstly accepts a selected product from **Products page** within a cart item (**CartItem** component) for user to select the size and the number of fashion product items (amount) and (by clicking on a corresponding **Save** button) save the item in the cart with those complete information; the same **CartItem** component is used to show purchased items of all sizes of a product; within the **Cart summary** block, the number and price of items to be purchased are reactively calculated, along with total price and savings obtained by application of a promo code (approval of which being mocked by corresponding .json files consisting information about discount and type of calculation - *percentage* or *difference* - in the suitable schema)
5. **No Page template**, set in the router to be applied correctly, for any page not listed in the Route components
6. **ProductPage** with product details (obtained from another API call - to **/detail** endpoint - on [HM - Hennes Mauritz fashion products API](https://rapidapi.com/apidojo/api/hm-hennes-mauritz/playground)) for the product selected on products page; the page displays product image gallery in the [react-image-gallery](https://github.com/xiaolin/react-image-gallery) component, as well as [react-rating](https://github.com/dreyescat/react-rating) product rating component

All project files are structured according to their role in the project (namely components, models, hooks, mocks and pages) within corresponding subfolders of **/src** project folder (with their corresponding .css style files along in the same folder). Public data used in the site are structured within **/img** and **/data** subfolders of **/public** folder (used in [localjsonapi branch](https://github.com/elab-development/klijentske-veb-tehnologije-2024-2022-0246-prodaja-modnih-proizvoda/tree/localjsonapi)). External API data types encompassed by **ProductResults** type are all defined in [productsData.ts](/src/models/productsData.ts). Basic logic and structure for products are implemented in the [productModel](/src/models/productModel.ts) model class, along with **Rating** interface, the segment of logic regarding product rating. User data structure is implemented in the [User](/src/models/userModel.ts) interface. Strongly-typed features are achieved by means of **Size** and **FilterOperation** enums of defined possible product sizes and filter operations respectively, **EnumKeys< T >** and **ObjectKeysFromEnum<T, P>** types, also exported from [productModel.ts file](/src/models/productModel.ts) (product sizes implemented as possible keys in *amounts* object property of **Product** class for storing numbers of purchased product items of corresponding sizes, or **FilterData** type expecting **Product** object properties as keys - also the fields filter operations should be applied to).

As part of seminar project requirements, [**ClientFilter**](/src/models/clientFilterModel.ts) model class is implemented, that separates logic for browser-side product filtering from products page. The **ClientFilter** class is generic, meaning it can accept array of elements of any type **T**, not just **Product**. Keys of array element object are automatically checked in VS Code by means of strong-type features described above. In order the state to be reactive on keys of a **ClientFilter**-class object, the [useReactState](/src/hooks/useReactState.ts) custom hook is implemented. Hence client-side filter is applied (as the **ClientFilter** class object's **applyFilter()** method) (within a function reacting...) to **filterItems** property key changes.

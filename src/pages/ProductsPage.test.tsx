import { describe, expect, it, vi } from "vitest";
import ProductsPage from "./ProductsPage";
import { fireEvent, render, screen } from "@testing-library/react";
import { Product } from "../models/productModel";
//qimport { Outlet } from "react-router-dom";

// useNavigate from Pagination.tsx and useLoaderData from ProductsPage should be mocked at the top level of this file
const mockedUseNavigate = vi.fn();
const mockedUseLoadData = vi.fn();
const mockedUseLocation = vi.fn();
const mockedUseParams = vi.fn();
const mockedOutlet = vi.fn();

vi.mock('react-router-dom', () => ({
   ...vi.importActual('react-router-dom') as Promise<unknown>,
  useNavigate: () => mockedUseNavigate,
  useLoaderData: () => mockedUseLoadData,
  useLocation: () => mockedUseLocation,
  useParams: () => mockedUseParams,
  Outlet: () => mockedOutlet()
}));

describe('Test ProductsPage page component with mocked API response server', () => {
    // mocked functions having been lifted-up to App
    const mockedOnAdd = vi.fn();
    const mockedOnRemove = vi.fn();
    const mockedAcceptPage = vi.fn();

    const loading = false; // test does not deal with loading phase

    it('renders "No products matching your criteria." on empty products response', () => {
        render(<ProductsPage products={[]} currentPage={1} perPage={16} productsCount={100} onAdd={mockedOnAdd} onRemove={mockedOnRemove} acceptPage={mockedAcceptPage} loadingProducts={loading} maxPrice={50} />);
        const el = screen.queryByText('No products matching your criteria.');
        expect(el).toBeInTheDocument();
    });

    it('fetches API data from /products and displays (correct count of) them', async () => {
        const response = await fetch('/products'); // should be intercepted by mocked server
        const data = await response.json();
        const products = data.products.map((el: unknown) => {
            const elem = el as Product;
            return new Product(elem.productid, elem.name, elem.description, elem.price, elem.images, elem.category, elem.recommended);
        });
        const productsCount = data.count;
        render(<ProductsPage products={products} currentPage={1} perPage={16} productsCount={productsCount} onAdd={mockedOnAdd} onRemove={mockedOnRemove} acceptPage={mockedAcceptPage} loadingProducts={loading} maxPrice={50} />);
        
        // just checking if API request is intercepted by mocked server - first productId is 100 instead of 1 - along with product item consistency check
        const addToCartLinks = screen.queryAllByText('Add to cart');
        for (const link of addToCartLinks) {
            if (link.parentElement?.parentElement?.parentElement?.style.backgroundImage.includes('3685338802_2_1_0.jpg')) { // got mocked product
                fireEvent.click(link);
                expect(mockedOnAdd).toBeCalledWith(100); //productId = 100 for mocked products
                break; // other links not relevant
            }
        }
        // test count of items equals perPage prop
        expect(addToCartLinks).toHaveLength(16);
    });

});
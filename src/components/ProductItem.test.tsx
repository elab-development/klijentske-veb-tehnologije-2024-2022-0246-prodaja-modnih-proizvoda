import { fireEvent, render, screen } from '@testing-library/react';
//import '@testing-library/jest-dom'; 
import ProductItem from '././ProductItem'; 
import { describe, expect, it, vi } from 'vitest';
import { Product } from '../models/productModel';

// useNavigate from Pagination.tsx should be mocked at the top level of this file
const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
   ...vi.importActual('react-router-dom') as Promise<unknown>,
  useNavigate: () => mockedUsedNavigate,
}));

describe('Test ProductItem component', () => {
    const testImageUrlPart = '03611306330-e1.jpg';
    const testPrice = 30;
    const testProductId = 11;
    const testProduct: Product = new Product(testProductId, "Pro 11", "Product 11", testPrice, testImageUrlPart, "Dresses", false);

    // mock functions performing logic in the App context
    const mockedOnAdd = vi.fn();
    const mockedOnRemove = vi.fn();

    //render ProductItem component with given test Product data
    render(<ProductItem product={testProduct} onAdd={mockedOnAdd} onRemove={mockedOnRemove} />);
  it('renders with correct product image, price and called productId to add to cart', () => {
    //find the corresponding product item HTML element
    const prodItemElement = document.getElementsByClassName("product-item")[0];

    //insure that background image CSS property is with test Image Url
    expect(prodItemElement).toHaveStyle({'background-image': `url(${testImageUrlPart})`});

    //find the corresponding product item HTML element
    const prodPriceElement = document.getElementsByClassName("pi-price")[0];

    //insure that the HTML element with pi-price CSS class is with text of test Price value in $
    expect(prodPriceElement).toHaveTextContent(`$ ${testPrice}`);

    //test if click on add to cart button calls onAdd(productId)
    const addToCartEl = screen.getByText('Add to cart');//document.evaluate(`//a[contains(., 'Add to cart')]`, document, null, XPathResult.ANY_TYPE, null).iterateNext();
    fireEvent.click(addToCartEl as Node);
    expect(mockedOnAdd).toBeCalledWith(testProductId);
  });
});
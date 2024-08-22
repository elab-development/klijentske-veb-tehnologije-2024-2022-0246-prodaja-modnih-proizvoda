import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Pagination from './Pagination';
import '@testing-library/jest-dom';

// useNavigate from Pagination.tsx should be mocked at the top level of this file
const mockedUsedNavigate = vi.fn();

vi.mock('react-router-dom', () => ({
   ...vi.importActual('react-router-dom') as Promise<unknown>,
  useNavigate: () => mockedUsedNavigate,
}));

const leftButton = "m11 18 1.41-1.41L7.83 12l4.58-4.59L11 6l-6 6z";
const rightButton = "M6.41 6 5 7.41 9.58 12 5 16.59 6.41 18l6-6z";

describe('Functionality test for Pagination component', () => {
  it('renders correctly for the central current page', () => {
    render(<Pagination pageBaseUrl="/products" numMiddle={3} paramType={"search"} currentPage={4} perPage={16} recordCount={100} />);

    //screen.debug();
    // Check if all pagination elements are rendered
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(document.querySelector(`.pagination path[d='${leftButton}']`)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(document.querySelector(`.pagination path[d='${rightButton}']`)).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
  
  it('removes "<<" button on first 2 + floor(numMiddle / 2) current pages and ">>" on last 2 + floor(numMiddle / 2) current pages', () => {
    const { rerender } = render(<Pagination pageBaseUrl="/products" numMiddle={3} paramType={"search"} currentPage={3} perPage={16} recordCount={100} />);
    expect(document.querySelector(`.pagination path[d='${leftButton}']`)).not.toBeInTheDocument();
    expect(document.querySelector(`.pagination path[d='${rightButton}']`)).toBeInTheDocument();

    rerender(<Pagination pageBaseUrl="/products" numMiddle={3} paramType={"search"} currentPage={5} perPage={16} recordCount={100} />);
    expect(document.querySelector(`.pagination path[d='${leftButton}']`)).toBeInTheDocument();
    expect(document.querySelector(`.pagination path[d='${rightButton}']`)).not.toBeInTheDocument();
  });

  it('marks selected current page', () => {
    render(<Pagination pageBaseUrl="/products" numMiddle={3} paramType={"search"} currentPage={3} perPage={16} recordCount={100} />);

    expect(screen.getByText('3')).toHaveClass('active');
    expect(screen.getByText('1')).not.toHaveClass('active');
    expect(screen.getByText('2')).not.toHaveClass('active');
    expect(screen.getByText('4')).not.toHaveClass('active');
  });
});
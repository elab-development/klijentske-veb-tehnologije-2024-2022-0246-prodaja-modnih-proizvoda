import { useEffect, useState } from "react";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import './Pagination.css'

interface PaginationProps {
    pageBaseUrl: string;
    paramType: 'search' | 'route';
    numMiddle: number; /* how many pages in the middle of pagination */
    perPage: number;
    recordCount: number;
    currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({pageBaseUrl, paramType, numMiddle, perPage, recordCount, currentPage}) => {
    const navigate = useNavigate();
    const paginationNumbers = [];
    const maxPage = Math.ceil(recordCount / perPage);
    const [currPage, setCurrPage] = useState(1); // auxiliary variable to estimate the current page at central position of pagination - except for first and last pages
    const [minMiddle, setMinMiddle] = 
        useState(currPage - Math.floor(numMiddle / 2) < 2 ? 2 : (currPage >= maxPage - Math.floor(numMiddle / 2) ? maxPage - numMiddle : currPage - Math.floor(numMiddle / 2)));

    for (let i = 1; i <= maxPage; i++) {
        paginationNumbers.push(i);
    }

    useEffect(() => {
        setCurrPage(currentPage); // cannot be set directly in useState because it would only be applied on the next render!!
    },[currentPage])

    useEffect(() => { // calculate minMiddle position - the lowest page number in the middle part of pagination - according to estimated curr(ent)Page, maxPage and numMiddle
        setMinMiddle(currPage - Math.floor(numMiddle / 2) < 2 ? 2 : (currPage >= maxPage - Math.floor(numMiddle / 2) ? maxPage - numMiddle : currPage - Math.floor(numMiddle / 2)));
    },[currPage, numMiddle, maxPage])

    const displayPage = (pn: number) => {navigate(`${pageBaseUrl}${paramType == 'route' ? '/' : '?page='}${pn}${perPage !== 16 ? (paramType == 'route' ? '/' : '&perPage=') + perPage : ''}`)} // display a corresponding page according to param type
    
    // callback when user clicked << button to see lower page numbers in the middle of pagination
    const stepBackward = () => {
        setCurrPage(currPage - numMiddle < 2 ? 1 : currPage - numMiddle);
    }
    // callback when user clicked >> button to see higher page numbers in the middle of pagination
    const stepForward = () => {
        setCurrPage(currPage + numMiddle <= maxPage ? currPage + numMiddle : maxPage - 1);
    }
    
    return (
        <div className="pagination">
            <div className={currentPage === 1 ? 'active' : ''} onClick={() => displayPage(1)}>1</div>
            {(minMiddle > 2) && (<div onClick={() => stepBackward()}><MdKeyboardDoubleArrowLeft /></div>)}
            {paginationNumbers.filter((page) => page >= minMiddle && page <= minMiddle + numMiddle - 1).map((page) => (
                <div key={page} className={currentPage === page ? 'active' : ''} onClick={() => displayPage(page)}>{page}</div>
            ))}
            {(minMiddle + numMiddle < maxPage) && (<div onClick={() => stepForward()}><MdKeyboardDoubleArrowRight /></div>)}
            <div className={currentPage === maxPage ? 'active' : ''} onClick={() => displayPage(maxPage)}>{maxPage}</div>
        </div>
    )
}

export default Pagination;
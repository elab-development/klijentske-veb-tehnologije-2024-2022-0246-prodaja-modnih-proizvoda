interface HeaderProps {
    position: React.CSSProperties["position"],
    backgroundColor: React.CSSProperties["backgroundColor"]
    user: User | Record<string, never>,
    loginUser: (email?: string | undefined, password?: string | undefined) => void;
    cartItemsCount: number;
}

import { Link } from 'react-router-dom'
import './Header.css'
import logo from "/img/logo.png"
import { IconContext } from "react-icons";
import { MdOutlineFavorite, MdPerson, MdSearch, MdShoppingCart } from 'react-icons/md';
import React, { useState } from 'react';
import { User } from '../models/userModel';

const Header: React.FC<HeaderProps> = ({position, backgroundColor, user, loginUser, cartItemsCount}) => {
    const {firstName, lastName} = user;
    const initialSearchTxt = `Search, my dear ${firstName} ${lastName}...`;
    const [searchTxt, setSearchTxt] = useState('');
    const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTxt(event.target.value)
    }
    
    return (
        <IconContext.Provider value={{ size: "3em", className: "icons-header" }}>   
            <div id="header" style={{position, backgroundColor}}>
                <div className="logo">
                    <Link to="/"><img src={logo} style={{borderRadius: '15px'}} /></Link>
                </div>
                <div className="search">
                    <div>
                        <input value={searchTxt} style={{color: "#8C8686"}} placeholder={initialSearchTxt} onChange={onInputChange} />
                        <IconContext.Provider value={{ size: "1.8em", color: "#8C8686" }}> 
                            <MdSearch id="search-icon"/>
                        </IconContext.Provider>
                    </div>
                </div>
                
                <div className="user">
                    <Link to="/user"><MdPerson /></Link>
                    <Link to="/cart"><MdShoppingCart />{ cartItemsCount.toString() !== "0" && <span className="badge">{cartItemsCount}</span> }</Link>
                    <Link to="/fav"><MdOutlineFavorite /></Link>
                    {user && user.firstName !== 'Site' && user.lastName !== 'User' ?
                    <button className="user-link" onClick={() => loginUser()}>Log out</button>
                    :
                    <><Link to="/login" className="user-link">Log in</Link>
                    <Link to="/signup" className="user-link">Sign Up</Link></>                   
                    }
                </div> 
            </div>
        </IconContext.Provider>
    )
}

export default Header
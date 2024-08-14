interface HeaderProps {
    position: React.CSSProperties["position"],
    backgroundColor: React.CSSProperties["backgroundColor"]
    user: User | Record<string, never>
}

import { Link } from 'react-router-dom'
import './Header.css'
import logo from "/img/logo.png"
import { IconContext } from "react-icons";
import { MdOutlineFavorite, MdPerson, MdSearch, MdShoppingCart } from 'react-icons/md';
import React, { useState } from 'react';
import { User } from '../models/userModel'

const Header: React.FC<HeaderProps> = ({position, backgroundColor, user}) => {
    const [searchTxt, setSearchTxt] = useState(`Search, my dear ${user.firstName} ${user.lastName}...`);
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
                        <input value={searchTxt} style={{color: "#8C8686"}} onChange={onInputChange} />
                        <IconContext.Provider value={{ size: "1.8em", color: "#8C8686" }}> 
                            <MdSearch id="search-icon"/>
                        </IconContext.Provider>
                    </div>
                </div>
                {user ?
                <div className="user">
                    <Link to="/user"><MdPerson /></Link>
                    <Link to="/cart"><MdShoppingCart /></Link>
                    <Link to="/fav"><MdOutlineFavorite /></Link>
                    <Link to="/login" className="user-link">Log in</Link>
                    <Link to="/signup" className="user-link">Sign Up</Link>
                </div>
                : 
                <div className="user">
                    <Link to="/user"><MdPerson /></Link>
                    <Link to="/cart"><MdShoppingCart /></Link>
                    <Link to="/fav"><MdOutlineFavorite /></Link>
                    <Link to="/login" className="user-link">Log in</Link>
                    <Link to="/signup" className="user-link">Sign Up</Link>
                </div>
                }
            </div>
        </IconContext.Provider>
    )
}

export default Header
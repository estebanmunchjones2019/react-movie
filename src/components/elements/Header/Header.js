import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './Header.css';

const Header = () => {
    return (
        <div className="rmdb-header">
            <div className="rmdb-header-content">
                <Link to="/">
                    <img className="rmdb-logo" src="./images/reactMovie_logo.png" alt="mrdb-logo" />
                </Link>
                
                <img className="rmdb-tmdb-logo" src="./images/tmdb_logo.png" alt="mrdb-logo" />
            </div>
        </div>
    )
}

Header.propTypes = {
    to: PropTypes.string
}

export default Header;
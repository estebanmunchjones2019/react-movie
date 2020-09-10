import React from 'react';
import {Link} from 'react-router-dom';
import './MovieThumb.css';

const MovieThumb = ({ movieId, movieName, image}) =>{
    return (
        <div className="rmdb-moviethumb">
            <Link to={{ pathname: `/${movieId}`, movieName:`${movieName}`}}>
                <img src={image} alt="moviethumb" />
            </Link>
        </div>
    )
}


export default MovieThumb;
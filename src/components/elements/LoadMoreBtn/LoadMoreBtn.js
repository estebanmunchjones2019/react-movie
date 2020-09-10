import React from 'react';
import './LoadMoreBtn.css';

const LoadMoreBtn = ({ onClick, text }) => {
    return (                                                                //I can't type onClick={onClick(true, "")} because it's creates an infinite loop when a component inside render() has a call to this.setState(). It just needs a anonymous callback and return the call to that function
        <div className="rmdb-loadmorebtn" onClick={ () => {onClick(true)}}> 
            <p>{text}</p>
        </div>
    )
}

export default LoadMoreBtn;
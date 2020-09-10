import React from 'react';
import FontAwesome from 'react-fontawesome';
import PropTypes from 'prop-types';
import './SearchBar.css';

class SearchBar extends React.Component {
    state = {
        value: ''
    }

    timeOut = null;

    doSearch = (event) => {
        this.setState({value: event.target.value});
        clearTimeout(this.timeOut);

        this.timeOut = setTimeout(() => {
            this.props.callback(false, this.state.value);
        }, 500);
    }

    render() {
        return (
            <div className="rmdb-searchbar">
                <div className="rmdb-searchbar-content">
                    <FontAwesome className="rmdb-fa-search" name="search" size="2x" />
                    <input
                        type="text" 
                        className="rmdb-searchbar-input"
                        placeholder="Search"
                        onChange={this.doSearch}
                        value={this.state.value}></input>
                </div>
           </div>
        )
    }
}

FontAwesome.propTypes = {
    name: PropTypes.string,
    size: PropTypes.string
}

export default SearchBar;
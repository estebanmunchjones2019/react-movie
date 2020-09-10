import React from 'react';
import { API_URL, API_KEY, IMAGE_BASE_URL, BACKDROP_SIZE, POSTER_SIZE } from '../../config';
import './Home.css';
import HeroImage from '../elements/HeroImage/HeroImage';
import SearchBar from '../elements/SearchBar/SearchBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import MovieThumb from '../elements/MovieThumb/MovieThumb';
import LoadMoreBtn from '../elements/LoadMoreBtn/LoadMoreBtn';
import Spinner from '../elements/Spinner/Spinner';
import PropTypes from 'prop-types';

class Home extends React.Component {
    state = {
        movies: [],
        heroImage: null,
        loading: false,
        currentPage: 0,
        totalPages: 0,
        searchTerm: ''
    }

    componentDidMount() {
        if (localStorage.getItem('HomeState')) {
            const state = JSON.parse(localStorage.getItem('HomeState'));
            this.setState({...state});
        } else {
            this.setState({loading:true});
            this.fetchitems(this.createEndpoint('movie/popular', false, ""));
        }
    }

    createEndpoint = (type, loadMore, searchTerm) => {
        return `${API_URL}${type}?api_key=${API_KEY}&page=
            ${loadMore && this.state.currentPage + 1}&query=${searchTerm}`;
      }

    updateItems = (loadMore, searchTerm) => {
        if (searchTerm !== "" && localStorage.getItem(searchTerm)) {
            const state = JSON.parse(localStorage.getItem(searchTerm));
            this.setState({...state});
        } else if (searchTerm === "" && localStorage.getItem("HomeState")) {
            const state = JSON.parse(localStorage.getItem("HomeState"));
            this.setState({...state});
        } else {
            this.setState({
                movies: loadMore ? [...this.state.movies] : [],
                loading: true,
                searchTerm: loadMore ? this.state.searchTerm : searchTerm
            }, () => {
                this.fetchitems(
                    !this.state.searchTerm ?
                    this.createEndpoint('movie/popular', loadMore, "") : // or I can put searchTerm "", but the state has that empty string as well
                    this.createEndpoint('search/movie', loadMore, this.state.searchTerm)
                )
            })
        }      
    }

    fetchitems = async (endpoint) => {
        const { movies, heroImage, searchTerm } = this.state;
        try {
            const moviesResults = await (await fetch(endpoint)).json();
            this.setState({
                movies: [...movies, ...moviesResults.results],
                heroImage: heroImage || moviesResults.results[0],
                loading: false,
                currentPage: moviesResults.page,
                totalPages: moviesResults.total_pages
                }, () => {
                    if ( searchTerm === '' ) {
                        localStorage.setItem('HomeState', JSON.stringify(this.state));
                    } else {
                        localStorage.setItem(`${searchTerm}`, JSON.stringify(this.state));
                    }
            })
        } catch (err) {
            console.log(`Error: err`);
        }
    }   

    render() {
        const { movies, heroImage, loading, currentPage, totalPages, searchTerm } = this.state;
        return (
            <div className="imdb-home">
                {heroImage && !searchTerm? 
                <div>
                    <HeroImage
                        image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${heroImage.backdrop_path}`}
                        title={`${heroImage.original_title}`}
                        text={`${heroImage.overview}`}
                    />
                </div> : null }
                <SearchBar callback={this.updateItems}/>
                <div className="mrdb-home-grid">
                    <FourColGrid 
                        header={searchTerm ? 'Search Result' : 'Popular Movies'}
                        loading={loading}
                    >
                    {movies.map((element, i)=>{
                        return <MovieThumb 
                                    key={i}
                                    clickable={true}
                                    image={element.poster_path ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}` : './images/no_image.jpg'}
                                    movieId={element.id}
                                    movieName={element.original_title}
                                />
                        })}
                    </FourColGrid>
                    {loading ? <Spinner /> : null}
                    {currentPage < totalPages && !loading ?
                <LoadMoreBtn text="Load More" onClick={this.updateItems} /> 
                : null }
                </div>
            </div>
        );
    }
};

HeroImage.propTypes = {
    image: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.string
}

SearchBar.propTypes = {
    callback: PropTypes.func,
}

FourColGrid.propTypes = {
    header: PropTypes.string,
    loading: PropTypes.bool
}

MovieThumb.propTypes = {
    clickable: PropTypes.bool,
    image: PropTypes.string,
    movieId: PropTypes.number,
    movieName: PropTypes.string
}

LoadMoreBtn.prototypes = {
    text: PropTypes.string,
    onClick: PropTypes.func
}
export default Home;
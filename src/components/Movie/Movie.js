import React from 'react';
import { API_URL, API_KEY } from '../../config';
import Navigation from '../elements/Navigation/Navigation';
import MovieInfo from '../elements/MovieInfo/MovieInfo';
import MovieInfoBar from '../elements/MovieInfoBar/MovieInfoBar';
import FourColGrid from '../elements/FourColGrid/FourColGrid';
import Actor from '../elements/Actor/Actor';
import Spinner from '../elements/Spinner/Spinner';
import './Movie.css';


class Movie extends React.Component {
    state = {
        movie: null,
        actors: null,
        directors: [],
        loading: false
    }

    componentDidMount() {
        const { movieId } = this.props.match.params;
        if (localStorage.getItem(`${movieId}`)) {
            const state = JSON.parse(localStorage.getItem(`${movieId}`));
            this.setState({...state});
        } else {
            this.setState({ loading: true });
            //first fetch the movie
            const endpoint = `${API_URL}movie/${movieId}?api_key=${API_KEY}`;
            this.fetchItems(endpoint);
        }
        
    }

    fetchItems = async (endpoint) => {
        const { movieId } = this.props.match.params;
        try {
            const movieResult = await (await fetch(endpoint)).json();
            if (movieResult.status_code){
                this.setState({ loading: false });
            } else {
                this.setState({ movie: movieResult }, async () => {
                    //fetch the actors and directors
                    const creditsEndpoint = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`;
                    const creditsResults = await (await fetch(creditsEndpoint)).json();
                    const directors = creditsResults.crew.filter((member) => member.job === "Director");
                    this.setState({
                        actors: creditsResults.cast,
                        directors,
                        loading: false
                    }, () => {
                        localStorage.setItem(`${movieId}`, JSON.stringify(this.state));
                    })
                })
            }
        } catch (err) {
            console.log(`Error: ${err}`);
        }
    }

    render() {
        const { movie, actors, directors, loading } = this.state;
        return (
            <div className="rmdb-movie">
                {this.state.movie ?
                    <div>
                        <Navigation movie={this.props.location.movieName} />
                        <MovieInfo movie={movie} directors={directors}/>
                        <MovieInfoBar time={movie.runtime} budget={movie.budget} revenue={movie.revenue}/>
                </div>
                : null }

                {actors ?
                    <div className="rmdb-movie-grid">
                        <FourColGrid header={'Actors'}>
                            {actors.map((element, i) => {
                                return <Actor key={i} actor={element} />
                            })}
                        </FourColGrid>
                    </div>
                : null }

                {!actors && loading.false ? <h1>No movie found!</h1> : null}
                {loading ? <Spinner /> : null }       
            </div>
        )
    }

}

export default Movie;

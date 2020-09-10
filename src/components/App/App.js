import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import NotFound from '../elements/NotFound/NotFound';
import Movie from '../Movie/Movie';
import Header from '../elements/Header/Header';
import PropTypes from 'prop-types';
import Home from '../Home/Home';

const App = () => {
    return (
        <BrowserRouter>
            <React.Fragment>
                <Header />
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/:movieId" component={Movie} exact />
                        <Route component={NotFound} />
                    </Switch>
            </React.Fragment>
        </BrowserRouter>
    );
}

Route.protoTypes = {
    path: PropTypes.string,
    component: PropTypes.instanceOf(Movie),
    exact: PropTypes.bool
}

export default App;

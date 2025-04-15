import { useEffect, useState } from 'react';
import './App.css';

import Header from './components/Header';
import Search from './components/Search';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage.jsx';
import MovieCard from './components/MovieCard.jsx';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
    method: 'GET',
    headers: {
        Accept: 'application/json',
        authorization: `Bearer ${API_KEY}`
    }
};

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?include_adult=true&language=en-US&sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) { throw new Error('Failed to fetch movies'); }

            const data = await response.json();

            if (data.Response === 'FALSE') {
                setErrorMessage('No movies found');
                setMovieList([]);

                return;
            }

            setMovieList(data.results);
        } catch (error) {
            console.error(error);

            setErrorMessage('Error occurred while fetching movies. Please try again later');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(searchTerm);
    }, [searchTerm]);

    return (
        <main>
            <div className="pattern"></div>

            <div className="wrapper">
                <Header />

                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

                <div className="all-movies">
                    <h2>All Movies</h2>

                    {isLoading ? (
                        <Loader />
                    ) : errorMessage ? (
                        <ErrorMessage errorMessage={errorMessage} />
                    ) : (
                        <ul>
                            {movieList.map(movie => <MovieCard key={movie.id} movie={movie} />)}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
};

export default App;

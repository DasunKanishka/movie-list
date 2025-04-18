import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import './App.css';
import { updateSearchCount, getTrendingMovies } from './appwrite.js';

import Header from './components/Header';
import Search from './components/Search';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';
import MovieCard from './components/MovieCard';
import TrendingMovieCard from './components/TrendingMovieCard';

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
    const [movieList, setMovieList] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Debounce the search term to prevent making too many API requests
    // Default 400ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 400, [searchTerm]);

    const fetchMovies = async (query = '', page = 1) => {
        setIsLoading(true);
        setErrorMessage('');

        try {
            const endpointParams = `${page}&&include_adult=true&include_video=true&language=en-US&&sort_by=popularity.desc`;
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&${endpointParams}`
                : `${API_BASE_URL}/discover/movie?${endpointParams}`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) { throw new Error('Failed to fetch movies'); }

            const data = await response.json();

            if (data.Response === 'FALSE') {
                setErrorMessage('No movies found');
                setMovieList([]);

                return;
            }

            setMovieList(data.results);

            if (query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (error) {
            console.error(`Error occurred while fetching movies: ${ error }`);

            setErrorMessage('Error occurred while fetching movies. Please try again later');
        } finally {
            setIsLoading(false);
        }
    }

    const loadTrendingMovies = async () => {
        try {
            const movies = await getTrendingMovies();

            setTrendingMovies(movies.documents);
        } catch (error) {
            console.error(`Error fetching trending movies: ${ error }`);

            setErrorMessage('Error occurred while fetching trending movies. Please try again later');
        }
    }

    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    useEffect(() => {
        loadTrendingMovies()
    }, []);

    return (
        <main>
            <div className="pattern"></div>

            <div className="wrapper">
                <Header />

                <Search searchTerm={ searchTerm } setSearchTerm={ setSearchTerm } />

                { isLoading && <Loader /> }

                { errorMessage && <ErrorMessage errorMessage={ errorMessage } /> }

                { trendingMovies.length > 0 && <section className="trending">
                    <h2>Trending Movies</h2>

                    <ul>
                        { trendingMovies.map((movie, index) =>
                            <li key={ movie.$id }>
                                <TrendingMovieCard movie={ movie } index={ index } />
                            </li>
                        ) }
                    </ul>
                </section> }

                { movieList.length > 0 && <section className="all-movies">
                    <h2>All Movies</h2>

                    <ul>
                        { movieList.map(movie =>
                            <li key={ movie.id } className="movie-card">
                                <MovieCard movie={ movie } />
                            </li>
                        )}
                    </ul>
                </section> }
            </div>
        </main>
    );
};

export default App;

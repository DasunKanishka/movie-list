import React from 'react';

const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const MovieCard = ({ movie:
    { title, poster_path, vote_average, release_date, original_language, adult }
}) => {
    return (
        <li className="movie-card">
            <img src={ poster_path ? `${POSTER_BASE_URL}/${poster_path}` : './no-movie.png' } alt={ title } />

            <h3 className="my-4">{ title }</h3>

            <div className="content">
                <div className="rating">
                    <img src="./star.svg" alt="Star Icon" />

                    <p>{ vote_average ? vote_average.toFixed(1) : 'N/A' }</p>
                </div>

                <span>&#8226;</span>

                <p className="lang">{ original_language }</p>

                <span>&#8226;</span>

                <p className="year">{ release_date ? release_date.split('-')[0] : 'N/A' }</p>

                { adult && <img src="./adults-only-sign.png" alt="Adults Only" className="adults-only block w-20" /> }
            </div>
        </li>
    );
}

export default MovieCard;
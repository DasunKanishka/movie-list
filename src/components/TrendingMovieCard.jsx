import React from 'react';

const TrendingMovieCard = ({ movie, index }) => {
    return (
        <>
            <p>{ index + 1 }</p>

            <img src={ movie.poster_url } alt={ movie.title } />
        </>
    );
}

export default TrendingMovieCard;
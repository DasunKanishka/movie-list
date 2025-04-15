import React from 'react';

const ErrorMessage = ({ errorMessage }) => {
    return <span className="block text-red-500">{ errorMessage }</span>;
}

export default ErrorMessage;
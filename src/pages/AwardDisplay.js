// src/DataDisplay.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AwardDisplay.css';

function AwardDisplay() {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the Flask API
        axios.get('https://awardsbackend-87cbab8eef7a.herokuapp.com/api/data')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("Error fetching data: ", error);
            });
    }, []);

    return (
        <div className="grid-container">
            {data.map(item => (
                <div className="grid-item" key={item.name}>
                    <h3>{item.name}</h3>
                    <p>Parent Company: {item.parentco}</p>
                    <p>Type: {item.type}</p>
                    <a href={item.websitelink} target="_blank" rel="noopener noreferrer">Visit Website</a>
                    {/* Add more fields as needed */}
                </div>
            ))}
        </div>
    );
}

export default AwardDisplay;

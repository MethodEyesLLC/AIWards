// src/DataDisplay.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AwardDisplay.css';

let API_URL = 'https://awardsbackend-87cbab8eef7a.herokuapp.com'
// let API_URL = 'http://localhost:5000'
function AwardDisplay() {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    console.log(API_URL + '/api/get_awardshows')

    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const response = await fetch(API_URL + '/api/get_awardshows');
            const data = await response.json();
            console.log(data.awardshows)
            setData(data.awardshows);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }

    const handleEdit = (item) => {
        setSelectedItem(item);
    }

    const handleSaveEdit = async (updatedItem) => {
        try {
            const response = await fetch(API_URL + `/api/edit_awardshows`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });

            const data = await response.json();

            if (data.success) {
                setSelectedItem(null);
                fetchData();
            } else {
                // Handle error
            }
        } catch (error) {
            console.error("Error updating the entry:", error);
        }
    }

    const handleDelete = async (id) => {
        try {
            const response = await fetch(API_URL + '/api/delete_awardshow?id=${id}', {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                fetchData();
            } else {
                // Handle error
            }
        } catch (error) {
            console.error("Error deleting the entry:", error);
        }
    }
    return (
        <div className="grid-container">
            {data.map(item => (
                <div className="grid-item" key={item.name}>
                    <h3>{item[1]}</h3>
                    <p>Parent Company: {item[2]}</p>
                    <p>Type: {item[3]}</p>
                    <a href={item[13]} target="_blank" rel="noopener noreferrer">Visit Website</a>



                    <button onClick={() => handleEdit(item)}>Edit</button>
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                    {
                        selectedItem && selectedItem.id === item.id &&
                        <div>
                            {/* Simplistic form example */}
                            <input type="text" value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} /><br />
                            <input type="text" value={selectedItem.parentco} onChange={(e) => setSelectedItem({ ...selectedItem, parentco: e.target.value })} /><br />
                            <input type="text" value={selectedItem.websitelink} onChange={(e) => setSelectedItem({ ...selectedItem, websitelink: e.target.value })} /><br />
                            <button onClick={() => handleSaveEdit(selectedItem)}>Save</button>
                        </div>
                    }
                </div>
            ))}
        </div>

    )

}

export default AwardDisplay;

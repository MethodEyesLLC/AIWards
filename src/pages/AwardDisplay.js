// src/DataDisplay.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AwardDisplay.css';

let API_URL = 'https://awardsbackend-87cbab8eef7a.herokuapp.com'
// let API_URL = 'http://localhost:5000'

function getQuarter(dateString) {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // because months are 0-indexed

    if (month <= 3) return 'Q1';
    if (month <= 6) return 'Q2';
    if (month <= 9) return 'Q3';
    return 'Q4';
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}
function AwardDisplay() {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');
    const [sortDeadlineOrder, setSortDeadlineOrder] = useState('asc');
    const [selectedQuarter, setSelectedQuarter] = useState(null);

    console.log(API_URL + '/api/get_awardshows')

    useEffect(() => {
        fetchData();
    }, []);


    const handleSort = () => {
        const sortedData = [...data].sort((a, b) => {
            if (sortOrder === 'asc') {
                return a[2].localeCompare(b[2]);
            } else {
                return b[2].localeCompare(a[2]);
            }
        });
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        setSortDeadlineOrder('asc'); // Reset deadline sort
        setData(sortedData);
    };
    const handleDeadlineSort = () => {
        const sortedData = [...data].sort((a, b) => {
            if (sortDeadlineOrder === 'asc') {
                return new Date(a[5]) - new Date(b[5]);
            } else {
                return new Date(b[5]) - new Date(a[5]);
            }
        });
        setSortDeadlineOrder(sortDeadlineOrder === 'asc' ? 'desc' : 'asc');
        setSortOrder('asc'); // Reset name sort
        setData(sortedData);
    };
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
    const handleCloseEdit = () => {
        setSelectedItem(null);
    }

    return (
        <div>

            <div className="sort-container">  {/* New container for sorting buttons */}
                <button onClick={handleSort}>Sort by Name ({sortOrder === 'asc' ? 'Descending' : 'Ascending'})</button>
                <button onClick={handleDeadlineSort}>Sort by Deadline ({sortDeadlineOrder === 'asc' ? 'Descending' : 'Ascending'})</button>
                <div className="quarter-filters">
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedQuarter === 'Q1'}
                            onChange={() => setSelectedQuarter(selectedQuarter === 'Q1' ? null : 'Q1')}
                        /> Q1
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedQuarter === 'Q2'}
                            onChange={() => setSelectedQuarter(selectedQuarter === 'Q2' ? null : 'Q2')}
                        /> Q2
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedQuarter === 'Q3'}
                            onChange={() => setSelectedQuarter(selectedQuarter === 'Q3' ? null : 'Q3')}
                        /> Q3
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedQuarter === 'Q4'}
                            onChange={() => setSelectedQuarter(selectedQuarter === 'Q4' ? null : 'Q4')}
                        /> Q4
                    </label>
                </div>
            </div>
            <div className="grid-container">
                {data
                    .filter(item => !selectedQuarter || getQuarter(item[5]) === selectedQuarter)
                    .map(item => (
                        <div className="grid-item" key={item.name}>
                            <h3>{item[2]}</h3>
                            {/* <p>Parent Company: {item[2]}</p> */}
                            <p>Type: {item[3]}</p>
                            <p>Deadline: {formatDate(item[5])}</p>
                            <p>Eligiblity Period: {item[11]}</p>
                            <a href={item[13]} target="_blank" rel="noopener noreferrer">Visit Website</a>



                            <button onClick={() => handleEdit(item)}>Edit</button>
                            <button className="delete-button" onClick={() => handleDelete(item.id)} disabled>Delete</button>
                            {
                                selectedItem && selectedItem[0] === item[0] &&
                                <div>
                                    {/* Simplistic form example */}
                                    <input type="text" value={selectedItem.name} onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })} /><br />
                                    <input type="text" value={selectedItem.parentco} onChange={(e) => setSelectedItem({ ...selectedItem, parentco: e.target.value })} /><br />
                                    <input type="text" value={selectedItem.websitelink} onChange={(e) => setSelectedItem({ ...selectedItem, websitelink: e.target.value })} /><br />
                                    <button onClick={() => handleSaveEdit(selectedItem)}>Save</button>
                                    <button className="soft-btn" onClick={handleCloseEdit}>Close</button>

                                </div>
                            }
                        </div>
                    ))}
            </div>
        </div>

    )

}

export default AwardDisplay;

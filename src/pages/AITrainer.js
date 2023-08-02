import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { templates } from '../templates';
import axios from 'axios'


const AITrainer = () => {
    const [text, setText] = useState('');
    const [score, setScore] = useState('');
    const [response, setResponse] = useState('');

    const handleAddEntry = async () => {
        try {
            await axios.post('https://awardsbackend-87cbab8eef7a.herokuapp.com/add-entry', { text, score });
            setResponse('Entry added to corpus successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    const handleTrainModel = async () => {
        try {
            await axios.post('https://awardsbackend-87cbab8eef7a.herokuapp.com/train-model', { text });
            setResponse('Vector generated and stored in Pinecone successfully!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <div>
                <h2>Add Entry</h2>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Text" />
                <select value={score} onChange={(e) => setScore(e.target.value)}>
                    <option value="">Rank this entry</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                </select>
                {/* <input type="number" value={score} onChange={(e) => setScore(e.target.value)} placeholder="Score" /> */}
                {/* <button onClick={handleAddEntry}>Add Entry</button> */}
            </div>
            <div>
                <h2>Train Model</h2>
                <button onClick={handleTrainModel}>Train Model</button>
            </div>
            <div>
                <h2>Response:</h2>
                <p>{response}</p>
            </div>
        </div>
    );
}

export default AITrainer;

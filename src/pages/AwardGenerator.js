import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { templates } from '../templates';
import axios from 'axios'

const SidebarMenu = () => {
  const [awardShow, setAwardShow] = useState(Object.keys(templates)[0]);
  const [category, setCategory] = useState(Object.keys(templates[awardShow])[0]);
  const [entry, setEntry] = useState(Object.keys(templates[awardShow][category])[0]);

  return (
    <div className="sidebar">
      <h3>Award Show</h3>
      <select value={awardShow} onChange={(e) => { setAwardShow(e.target.value); setCategory(Object.keys(templates[e.target.value])[0]); setEntry(Object.keys(templates[e.target.value][category])[0]) }}>
        {Object.keys(templates).map((show) => (
          <option key={show} value={show}>
            {show}
          </option>
        ))}
      </select>

      <h3>Category</h3>
      <select value={category} onChange={(e) => { setCategory(e.target.value); setEntry(Object.keys(templates[awardShow][e.target.value])[0]) }}>
        {Object.keys(templates[awardShow]).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <h3>Entry</h3>
      <select value={entry} onChange={(e) => setEntry(e.target.value)}>
        {Object.keys(templates[awardShow][category]).map((ent) => (
          <option key={ent} value={ent}>
            {ent}
          </option>
        ))}
      </select>
    </div>
  );
};

const AwardGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [campaignInfo, setCampaignInfo] = useState('');
  const [formality, setFormality] = useState(1);
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState(''); // new state for storing user feedback
  const [rating, setRating] = useState(1); // new state for storing user rating
  const [awardShow, setAwardShow] = useState(Object.keys(templates)[0]);
  const [category, setCategory] = useState(Object.keys(templates[awardShow])[0]);
  const [entry, setEntry] = useState(Object.keys(templates[awardShow][category])[0]);

  let formalityInstruction;

  if (formality === 3) {
    formalityInstruction = 'Write this in a very formal style, like a legal document.';
  } else if (formality === 2) {
    formalityInstruction = 'Write this in a professional, businesslike style.';
  } else {
    formalityInstruction = 'Write this in a casual, friendly, but work-appropriate style.';
  }
  const handleFeedback = async () => {
    try {
      // prepare your feedback data
      const feedbackData = {
        feedback: feedback,
        rating: rating,
        prompt: prompt,
        wordCount: parseInt(wordCount),
        campaignInfo: campaignInfo,
        formalityInstruction: formality,
        output: output,

        // add any other data you need
      };

      // send POST request to your backend
      const response = await axios.post('https://awardsbackend-87cbab8eef7a.herokuapp.com/api/rating', feedbackData);

      // check response
      if (response.data.success) {
        // clear the feedback form
        setFeedback('');
        setRating(1);
        alert('Thank you for your feedback!');
      } else {
        alert('Failed to send feedback. Please try again.');
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleSubmit = async () => {

    setLoading(true);



    try {
      // Request data
      const data = {
        prompt: prompt,
        wordCount: parseInt(wordCount),
        campaignInfo: campaignInfo,
        formalityInstruction: formality,

      };

      // Send POST request to Flask backend
      const response = await fetch('https://awardsbackend-87cbab8eef7a.herokuapp.com/api/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify
          (data)
      });

      // Parse response data
      const responseData = await response.json();
      if (responseData.error) {
        console.error('Error from Flask API:', responseData.error);
      } else {
        setOutput(responseData.output);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error sending data to Flask API:', error);
      setLoading(false);
    }
  }


  return (
    <div className="container-fluid" style={{ paddingTop: "10vh" }}>
      <div className="row">
        <div className="col-md-2">
          <SidebarMenu />
        </div>
        <div className="col-md-10">
          <div className="container mt-5" style={{ paddingBottom: "20vh" }}>
            <div className="row">
              <div className="col-lg-8 offset-lg-2">
                <div className="form-group">
                  <label htmlFor="prompt">Prompt:</label>
                  <textarea
                    className="form-control"
                    id="prompt"
                    rows="3"
                    // value={templates[awardShow][category][entry]}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="wordCount">Word Count:</label>
                  <textarea
                    className="form-control"
                    id="wordCount"
                    rows="3"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="campaignInfo">Campaign Information:</label>
                  <textarea
                    className="form-control"
                    id="campaignInfo"
                    rows="3"
                    value={campaignInfo}
                    onChange={(e) => setCampaignInfo(e.target.value)}
                  />
                </div>
                <label htmlFor="formality">Formality:</label>
                <input
                  type="range"
                  id="formality"
                  name="formality"
                  min="1"
                  max="3"
                  step="1"
                  value={formality}
                  onChange={(e) => setFormality(e.target.value)}
                />
                {loading && <div>Loading...</div>}
                <button className="btn btn-primary" onClick={handleSubmit}>Send</button>
                <div className="form-group mt-4">
                  <label htmlFor="output">Output:</label>
                  <textarea className="form-control" id="output" rows="3" value={output} onChange={(e) => setOutput(e.target.value)}  />
                </div>
                <div className="form-group mt-4">
                  <label htmlFor="feedback">Feedback (Optional):</label>
                  <textarea className="form-control" id="feedback" rows="3" value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                  <label htmlFor="rating" className="mt-2">Rate this Output:</label>
                  
                  <select id="rating" value={rating} onChange={(e) => setRating(e.target.value)} className="form-control">
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                  </select>
                  <p3>
                    NOTE: If there is anything in the output that we should omit, like a reference to training material, please delete before submitting feedback.
                  </p3>
                  <br />
                  <button className="btn btn-primary mt-2" onClick={handleFeedback}>Submit Feedback</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AwardGenerator;

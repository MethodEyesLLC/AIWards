import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import { templates } from '../templates';
import axios from 'axios'

const API_URL = 'http://localhost:5000'
const inlineStyles = {
    WebkitTextSizeAdjust: "100%",
    tabSize: 4,
    fontFamily: "Ubuntu, sans-serif",
    lineHeight: "inherit",
    boxSizing: "border-box",
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "#e5e7eb",
    width: "100%",
    backgroundColor: "rgba(10, 21, 36, 1)", // This assumes that the background opacity is always 1
    paddingBottom: "5rem",
    color: "white",

    // Other properties have been omitted for brevity and compatibility
};
const cardStyles = {
    maxWidth: '800px',  // you can adjust this value based on your preference
    margin: '0 auto',
    padding: '50px',
    boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.1)',  // Adding a subtle shadow
    borderRadius: '10px'  // Slight border radius
};

// const RenderSections = ({ data }) => {
//     // Check if data is a string and try to parse it
//     let parsedData = data;
//     if (typeof data === 'string') {
//         try {
//             parsedData = JSON.parse(data);
//         } catch (error) {
//             console.error("Failed to parse data:", error);
//             return <div>Error rendering sections.</div>;
//         }
//     }

//     // Ensure parsedData is an object before rendering
//     if (typeof parsedData !== 'object' || parsedData === null) {
//         console.error("Data is not an object:", parsedData);
//         return <div>Error rendering sections.</div>;
//     }

//     return (
//         <div>
//             {Object.keys(parsedData).map(sectionKey => {
//                 const section = parsedData[sectionKey];
//                 return (
//                     <div key={sectionKey} className="mb-4">
//                         <h4>{section.label}</h4>
//                         <p>{section.description}</p>
//                         {section.questions && section.questions.map((question, index) => (
//                             <div key={index} className="mb-2">
//                                 <h5>{question.label} (Word count: {question.wordcount || 'N/A'})</h5>
//                                 <p>{question.description}</p>
//                             </div>
//                         ))}
//                     </div>
//                 );
//             })}
//         </div>
//     );
// };


const SidebarMenu = () => {
    const [awardShow, setAwardShow] = useState(Object.keys(templates)[0]);
    const [category, setCategory] = useState(Object.keys(templates[awardShow])[0]);
    const [entry, setEntry] = useState(Object.keys(templates[awardShow][category])[0]);

    return (
        <div className="sidebar" style={{ backgroundColor: `rgba(213, 86, 61)`, height: '100vh', paddingTop: "5vh", paddingLeft: "1vw" }}>
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
    const [awardShowQuestions, setAwardShowQuestions] = useState(''); // state to store the fetched questions



    useEffect(() => {
        // Function to fetch questions for the selected award show
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get_awardshow_questions?name=EffieAwardsUnitedStates`);
                if (response.data.questions) {
                    setAwardShowQuestions(response.data.questions);

                    // Set the prompt with the first question's description
                    if (response.data.questions[0] && response.data.questions[0].description) {
                        setPrompt(response.data.questions[0].description);
                    }
                }
            } catch (error) {
                console.error('Error fetching questions:', error);
            }
        };

        fetchQuestions();
    }, [awardShow]);

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
                // prompt: JSON.stringify(awardShowQuestions), // Stringify the entire awardShowQuestions object
                wordCount: parseInt(wordCount),
                campaignInfo: campaignInfo,
                formalityInstruction: formality,
            };

            // Send POST request to Flask backend
            const response = await fetch(API_URL + '/api/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
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
        <div className="container-fluid px-0" style={inlineStyles}>
            <div className="row h-100"> {/* Full height row */}
                {/* Sidebar */}
                <div className="col-md-2">
                    <SidebarMenu />
                </div>
                {/* Main Content */}
                <div className="col-md-10 d-flex flex-column justify-content-center" style={{ minHeight: "100vh" }}>
                    <div className="container mt-5">
                        <div className="row">
                            <div className="col-lg-8 mx-auto">
                                <div className="form-group">
                                    <h3 className="card-header-center">
                                        Generate Award
                                    </h3>
                                    <div className="card" style={cardStyles}>
                                        <div className="card-body">
                                            {/* <RenderSections data={awardShowQuestions} /> */}
                                            Prompt:
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
                                        <button className="btn btn-primary" style={{ backgroundColor: `rgba(213, 86, 61)`, width: "15vw", marginTop: "2vh" }} onClick={handleSubmit}>Send</button>
                                    </div>
                                </div>

                                <div className="form-group mt-4">
                                    <label htmlFor="output">Output:</label>
                                    <textarea className="form-control" id="output" rows="3" value={output} onChange={(e) => setOutput(e.target.value)} />
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

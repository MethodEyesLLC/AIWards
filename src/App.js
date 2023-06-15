import React, { useState } from 'react';
import { Configuration, OpenAIApi } from "openai";
import 'bootstrap/dist/css/bootstrap.min.css'

const apiKey = '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'; // Be sure to add your OpenAI API key in your .env file
const openai = new OpenAIApi(new Configuration({ apiKey }));

const App = () => {
  const [prompt, setPrompt] = useState('');
  const [wordCount, setWordCount] = useState('');
  const [campaignInfo, setCampaignInfo] = useState('');
  const [formality, setFormality] = useState(1);
  const [output, setOutput] = useState('');


  let formalityInstruction;

  if (formality === 3) {
    formalityInstruction = 'Write this in a very formal style, like a legal document.';
  } else if (formality === 2) {
    formalityInstruction = 'Write this in a professional, businesslike style.';
  } else {
    formalityInstruction = 'Write this in a casual, friendly, but work-appropriate style.';
  }

  const handleSubmit = async () => {
    const input = `${prompt} in paragraph form, in under ${wordCount} words (which includes symbols), but get as close as possible to this word count, using the information provided in this award entry:  ${campaignInfo}`;
    console.log(input)
    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "user",
          content: `Pretend you are a creative director at a major creative advertising firm. You are creative, but to the point. You want to make your ideas and products sound polished, yet somewhat fun. You do not overuse adjectives or adverbs. Unless explicitly prompted to provide results, you do not provide results of campaigns at all. You strictly answer the question prompted. ${formalityInstruction}` + input
        }],
      });
      setOutput(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
    }
  }

  return (
    <div className="container mt-5" style={{ paddingBottom: "20vh" }}>
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <div className="form-group">
            <label htmlFor="prompt">Prompt:</label>
            <textarea
              className="form-control"
              id="prompt"
              rows="3"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="wordCount">Word Count:</label>
            <textarea
              className="form-control"
              id="wordCount"
              rows="3"
              value={wordCount}
              onChange={e => setWordCount(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="campaignInfo">Campaign Information:</label>
            <textarea
              className="form-control"
              id="campaignInfo"
              rows="3"
              value={campaignInfo}
              onChange={e => setCampaignInfo(e.target.value)}
            />

          </div>
          <label for="formality">Formality:</label>
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

          <button className="btn btn-primary" onClick={handleSubmit}>Send</button>
          <div className="form-group mt-4">
            <label htmlFor="output">Output:</label>
            <textarea className="form-control" id="output" rows="3" value={output} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

const express = require('express');
const axios = require('axios');
const bardapi = require('@xelcior/bard-api');
const fs = require('fs');

const app = express();
app.use(express.json());

// ChatGPT Route
app.get('/chatgpt', async (req, res) => {
  try {
    const { ask } = req.query;

    const response = await axios.post('https://api.pawan.krd/v1/completions', {
      model: 'text-davinci-003',
      prompt: `Human: ${ask}\nAI:`,
      temperature: 0.7,
      max_tokens: 256,
      stop: ['Human:', 'AI:']
    }, {
      headers: {
        'Authorization': 'Bearer pk-fAahQonrhkSdbrUQAenJgmNbtCSpmpeKTJewTcgnUbeRFkRa',
        'Content-Type': 'application/json'
      }
    });

    const { choices } = response.data;
    const answer = choices[0].text.trim();

    res.json({ answer });
  } catch (error) {
    console.error('Error fetching answer:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching the answer' });
  }
});

// Bard API Route
app.get('/answer', async (req, res) => {
  try {
    const question = req.query.question;
    if (!question) {
      res.status(400).json({ error: 'Missing question parameter' });
      return;
    }

    const sessionToken = await getSessionToken();
    if (!sessionToken) {
      res.status(500).json({ error: 'Session token not found' });
      return;
    }

    const _bard = new bardapi(sessionToken);
    const answer = await _bard.getAnswer(question);
    res.json({ answer });
  } catch (error) {
    console.error('Error fetching answer:', error);
    res.status(500).json({ error: 'An error occurred while fetching the answer' });
  }
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Helper function to get session token
function getSessionToken() {
  return new Promise((resolve, reject) => {
    fs.readFile('session_token.log', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const sessionToken = data.trim().split('\n')[0];
        resolve(sessionToken || null);
      }
    });
  });
}

app.listen(3000, () => {
  console.log('Express API server is running on port 3000');
});

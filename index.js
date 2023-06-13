const express = require('express');
const bardapi = require('@xelcior/bard-api');
const fs = require('fs');

const app = express();

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

// Error handler middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(3000, () => {
  console.log('Express API server is running on port 3000');
});

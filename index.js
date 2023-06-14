const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

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

app.all('/ask-gpt', async (req, res) => {
  try {
    const question = req.query.question || req.body.question;
    if (!question) {
      res.status(400).json({ error: 'Missing question parameter' });
      return;
    }

    const response = await axios.post('https://api.pawan.krd/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
      max_tokens: 100,
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: question }
      ]
    }, {
      headers: {
        'Authorization': 'Bearer pk-***[OUR_API_KEY]***',
        'Content-Type': 'application/json'
      }
    });

    if (response.status !== 200) {
      console.error('Error response from GPT API:', response.status);
      res.status(500).json({ error: 'An error occurred while fetching the answer from GPT' });
      return;
    }

    const { choices } = response.data;
    if (!choices || choices.length === 0) {
      console.error('No choices received from GPT API');
      res.status(500).json({ error: 'An error occurred while fetching the answer from GPT' });
      return;
    }

    const answer = choices[0].message.content;

    if (!answer) {
      console.error('No answer received from GPT API');
      res.status(500).json({ error: 'An error occurred while fetching the answer from GPT' });
      return;
    }

    res.json({ answer });
  } catch (error) {
    console.error('Error fetching answer from GPT:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching the answer from GPT' });
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

const Discord = require('discord.js');
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env file

const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
const prefix = '!'; // Command prefix

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Ignore messages from bots and messages without the prefix
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  // Extract the command and question from the message content
  const [command, ...args] = message.content.slice(prefix.length).trim().split(' ');
  const question = args.join(' ');

  if (command === 'ask-gpt') {
    // Send the question to the Express API endpoint
    try {
      const response = await axios.get(`http://localhost:3000/ask-gpt?question=${encodeURIComponent(question)}`);
      const answer = response.data.answer;

      // Check if the answer is a non-empty string
      if (typeof answer === 'string' && answer.trim() !== '') {
        // Create an embed to display the question and answer
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('ChatGPT Answer')
          .setDescription(answer)
          .setAuthor('ChatGPT', 'https://1000logos.net/wp-content/uploads/2023/02/ChatGPT-Logo.jpg')
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send('Sorry, I could not generate an answer with ChatGPT.');
      }
    } catch (error) {
      console.error('Error fetching answer from ChatGPT:', error.message);
      message.channel.send('Sorry, an error occurred while fetching the answer from ChatGPT.');
    }
  } else if (command === 'ask-gpt-unrestricted') {
    // Send the question to the Express API endpoint
    try {
      const response = await axios.get(`http://localhost:3000/ask-gpt-uncensored?question=${encodeURIComponent(question)}`);
      const answer = response.data.answer;

      // Check if the answer is a non-empty string
      if (typeof answer === 'string' && answer.trim() !== '') {
        // Create an embed to display the question and answer
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Unrestricted ChatGPT Answer')
          .setDescription(answer)
          .setAuthor('ChatGPT (Unrestricted)', 'https://1000logos.net/wp-content/uploads/2023/02/ChatGPT-Logo.jpg')
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send('Sorry, I could not generate an answer with unrestricted ChatGPT.');
      }
    } catch (error) {
      console.error('Error fetching answer from unrestricted ChatGPT:', error.message);
      message.channel.send('Sorry, an error occurred while fetching the answer from unrestricted ChatGPT.');
    }
  } else if (command === 'ask-code-gpt') {
    // Send the question to the Express API endpoint
    try {
      const response = await axios.get(`http://localhost:3000/code-gpt?question=${encodeURIComponent(question)}`);
      const answer = response.data.answer;

      // Check if the answer is a non-empty string
      if (typeof answer === 'string' && answer.trim() !== '') {
        // Create an embed to display the question and answer
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('CodeGPT Answer')
          .setDescription(answer)
          .setAuthor('CodeGPT', 'https://example.com/codegpt-logo.png') // Replace with the actual CodeGPT logo URL
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send('Sorry, I could not generate an answer with CodeGPT.');
      }
    } catch (error) {
      console.error('Error fetching answer from CodeGPT:', error.message);
      message.channel.send('Sorry, an error occurred while fetching the answer from CodeGPT.');
    }
  } else if (command === 'ask-code-gpt-mean') {
    // Send the question to the Express API endpoint
    try {
      const response = await axios.get(`http://localhost:3000/code-gpt-mean?question=${encodeURIComponent(question)}`);
      const answer = response.data.answer;

      // Check if the answer is a non-empty string
      if (typeof answer === 'string' && answer.trim() !== '') {
        // Create an embed to display the question and answer
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('CodeGPT (Unrestricted) Answer')
          .setDescription(answer)
          .setAuthor('CodeGPT (Unrestricted)', 'https://example.com/codegpt-unrestricted-logo.png') // Replace with the actual CodeGPT (Unrestricted) logo URL
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send('Sorry, I could not generate an answer with unrestricted CodeGPT.');
      }
    } catch (error) {
      console.error('Error fetching answer from unrestricted CodeGPT:', error.message);
      message.channel.send('Sorry, an error occurred while fetching the answer from unrestricted CodeGPT.');
    }
  }
});

client.login(process.env.DISCORD_TOKEN);

const Discord = require('discord.js');
const axios = require('axios');

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

  if (command === 'ask') {
    // Send the question to the Express API endpoint
    try {
      const response = await axios.get(`http://localhost:3000/answer?question=${encodeURIComponent(question)}`);
      const answer = response.data.answer;

      // Check if the answer is a non-empty string
      if (typeof answer === 'string' && answer.trim() !== '') {
        // Create an embed to display the question and answer
        const embed = new Discord.MessageEmbed()
          .setColor('#0099ff')
          .setTitle('Answer')
          .setDescription(answer)
          .setAuthor('Bard', 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Google_Bard_logo.svg/600px-Google_Bard_logo.svg.png?20230425130013')
          .setTimestamp();

        message.channel.send({ embeds: [embed] });
      } else {
        message.channel.send('Sorry, I could not find an answer to that question.');
      }
    } catch (error) {
      console.error('Error fetching answer:', error.message);
      message.channel.send('Sorry, an error occurred while fetching the answer.');
    }
  } else if (command === 'ask-gpt') {
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
  }
});

client.login('CLIENT-TOKEN-HERE');

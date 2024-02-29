const { Client, GatewayIntentBits } = require('discord.js');

const trelloBoardId = 'il tuo id trello';
const trelloApiKey = 'la tua apikey';
const trelloToken = 'il tuo token segreto ';
const channelId = 'id del tuo canale discord';
const discordToken = 'il tuo token discord';

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
	],
});

let previousActions = [];

client.on('ready', () => {
  console.log(`loggato come ${client.user.tag}`);
  sendDiscordMessage(`il bot adesso e' online`)
  setInterval(trackTrelloChanges, 1800000); //ogni trenta minuti
  console.log('Monitoraggio delle modifiche di Trello avviato.');
});

const sendDiscordMessage = (message) => {
  const channel = client.channels.cache.get(channelId);
  if (channel) {
    channel.send(message);
  }
};

const trackTrelloChanges = async () => {
    try {
      const response = await fetch(`https://api.trello.com/1/boards/${trelloBoardId}/actions?key=${trelloApiKey}&token=${trelloToken}`);
      if (!response.ok) {
        throw new Error('Errore nella richiesta API di Trello');
      }
      const currentActions = await response.json();
      if (!arraysAreEqual(previousActions, currentActions)) {
        console.log('Cambiamenti sulla bacheca di Trello:', currentActions);
        previousActions = currentActions;
        const latestAction = currentActions[currentActions.length - 1];
      const ultimoUsername = latestAction.memberCreator.fullName;
      const tipoModifica = latestAction.type
      console.log(tipoModifica);
      
      sendDiscordMessage(`${ultimoUsername} ha modificato Trello con ${tipoModifica}!`);
      }else{
        console.log('nessuna modifica')
      }
    } catch (error) {
      console.error('Errore nel monitoraggio delle modifiche di Trello:', error.message);
    }
};


function arraysAreEqual(array1, array2) {
  if (array1.length !== array2.length) {
    return false;
  }
  for (let i = 0; i < array1.length; i++) {
    if (JSON.stringify(array1[i]) !== JSON.stringify(array2[i])) {
      return false;
    }
  }
  return true;
}

client.login(discordToken);

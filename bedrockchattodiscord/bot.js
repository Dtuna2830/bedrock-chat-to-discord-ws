const WebSocket = require('ws') 
const uuid = require('uuid') 
const Discord = require('discord.js'); 
const {Client, Intents} = require('discord.js');
const client = new Client({
    intents: [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_PRESENCES,
      Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
  })
const port = 19131 
const botToken = 'token' 
const channelId = 'channelid' 
const ipAddress = 'your ip' 

console.log(`Ready. In Minecraft chat, type /connect ${ipAddress}:${port}`)
const wss = new WebSocket.Server({ port: port })

var globalSocket

wss.on('connection', socket => {
  console.log('Connected to Minecraft!') 
  globalSocket = socket 

  
  socket.send(JSON.stringify({
    "header": {
      "version": 1,
      "requestId": uuid.v4(),
      "messageType": "commandRequest",
      "messagePurpose": "subscribe"
    },
    "body": {
      "eventName": "PlayerMessage"
    },
  }))

  
  socket.on('message', packet => {
    const msg = JSON.parse(packet) //Parse the JSON


    

    
    try{
      
      


        
        if ((msg.header.eventName == 'PlayerMessage')) {

          
          if ((msg.body.sender != 'Harici')) {

          const sender = msg.body.sender;
          const message = msg.body.message;

          client.channels.cache.get(channelId).send(`${sender}: ${message}`)
          console.log(`<${sender}>: ${message}`)
          return;

          }
        
        }

        

    }

    
    catch{}
  })
})


function send(text) {
  
  cmd = 'say ' + text

  
  const msg = JSON.stringify({
    "header": {
      "version": 1,
      "requestId": uuid.v4(),
      "messagePurpose": "commandRequest",
      "messageType": "commandRequest"
    },
    "body": {
      "version": 1,
      "commandLine": cmd,
      "origin": {
        "type": "player"
      }
    }
  })

  
  try{
    globalSocket.send(msg)
  }
  catch{
    console.log("Failed to send message to minecraft. Are you logged in?")
  }
}




client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});


client.on('messageCreate', msg => {
  if(msg.channel.id != channelId) 
    return;
  
  if(msg.author.bot) 
    return;
  
  const sender = msg.member.displayName
  const message =  msg.content;

  
  if((msg.member.displayName != 'undefined:')) {
  send(`${sender}: ${message}`); 
  }
});

//"Sign in" to discord
try{
  client.login(botToken)
}
catch{
  console.log("Failed to sign into discord. Is the bot token correct?")
}
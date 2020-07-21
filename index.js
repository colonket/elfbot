const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./bot_config.json');
var counterActivity = 0;

// When the bot succesfully logs in
client.on('ready', () => {
	client.user.setUsername('Elf Bot');
	//client.user.setAvatar('elfbot.png');
	console.log(`Logged in as ${client.user.tag}!`);
	setInterval(() => {
        setRandomActivity(activities);
    }, 5*60*1000); // Runs this every 5 minutes.
});

// When a message is sent in the server
client.on('message', msg => {
	roll = msg.content.startsWith("!roll");
	flip = msg.content.startsWith("!flip");
	coin = msg.content.startsWith("!coin");
	
	if (roll){
		rollDice(msg);
	}
	if (flip || coin){
		args = msg.content.split(' ');
		coinFlip(msg, args[1]);
	}

});

client.login(config.token);

function coinFlip(msg, times = 1){
	times = parseInt(times);
	if(times == NaN){
		msg.channel.send("I'm not sure how many coins that is... :thinking:");
		console.log(typeof times);
		return;
	}
	if(times > 1000){
		msg.channel.send("My tiny hands can't flip more than 1000 coins :cry:");
		return;
	}
	if(times == 1) outcome = "";
	else outcome = `__You flipped ${times} coins__\n`;
	
	do {
		value = (Math.floor(Math.random() * 2) == 0);
		if (value)
			outcome += "**HEADS** ";
		else
			outcome += "_tails_ ";
		
		times--;
	} while (times > 0);
	return msg.channel.send(outcome);
}

function rollDice(msg,times=9,sides=6){
	// Roll a 'sides'-sided die, 'times' times.
	return msg.channel.send(`You want me to roll a ${sides}-sided die ${times} times... but I don't know how to do that yet.`);
}

function setRandomActivity(activities){
	var randomIndex = Math.floor(Math.random() * activities.length);
	client.user.setActivity(activities[randomIndex][0],activities[randomIndex][1]);
}

var activities = [
	// activity types: PLAYING, STREAMING, LISTENING, WATCHING
	// TODO - Make it so you don't have to redundantly define the type of activity
	["you... uwu",{type: 'LISTENING'}],
	["a bard sing",{type: 'LISTENING'}],
	["you roll bad!",{type: 'WATCHING'}],
	["you roll well!", {type: 'WATCHING'}],
	["a pretty ballad", {type: 'PLAYING'}],
	["Dungeons & Dragons!",{type: 'PLAYING'}],
	["a One-Off",{type: 'PLAYING'}],
	["with fire",{type:"PLAYING"}],
	["the soft breeze",{type: 'LISTENING'}],
	["a Vicious Mockery",{type: 'LISTENING'}]
]

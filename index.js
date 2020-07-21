// Invite this bot to your server!
// https://discord.com/oauth2/authorize?client_id=734224877195755600&scope=bot
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./bot_config.json');

// When the bot succesfully logs in
client.on('ready', () => {
	client.user.setUsername('Elf Bot');
	//client.user.setAvatar('elfbot.png'); // Discord doesn't like getting frequent avatar change requests
	console.log(`Logged in as ${client.user.tag}!`);
	setInterval(() => {
        setRandomActivity(activities);
    }, 5*60*1000); // Changes activity every 5 minutes.
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

client.login(config.token); // Let the bot log-in!

function coinFlip(msg, times = 1){
	times = parseInt(times); // Sanitize the input! *scrubscrubscrub*
	if(isNaN(times)){ // Can't flip a non-number amount...
		msg.channel.send("I'm not sure how many coins that is... :thinking:");
		return;
	}
	// TO-DO - Use time measurement to set a cut-off time on calculating the outcome of a coin flip
	if(times > 10**6){ // Too many coins will hang up the bot.
		msg.channel.send("I'm too weak to flip more than a million coins :pensive:");
		return;
	}
	// This code is not ideal but it works for now :pensive:
	if(times == 1) outcome = "";
	else outcome = `__You flipped ${times} coins__\n`
	
	int_headsCount = 0;
	int_tailsCount = 0;
	do {
		flipValue = (Math.floor(Math.random() * 2) == 0);
		if (flipValue)
			int_headsCount++;
		else
			int_tailsCount++;	
		times--;
	} while (times > 0);
	if(outcome == ""){
		if (int_headsCount)
			outcome += "**HEADS**";
		else
			outcome += "_tails_";
		return msg.channel.send(outcome);
	}
	outcome += `**HEADS**: ${int_headsCount}\n_tails_: ${(int_tailsCount)}`;
	return msg.channel.send(outcome);
}

function rollDice(msg,times=9,sides=6){
	// Roll a 'sides'-sided die, 'times' times.
	// Ex. d20 | 4d20 | d6+9 | d6 + d9
	args = msg.content.split(" ");

	// I'm tired for now so I'm just gonna make a lazy functional thing.
	if (!args[1]) return msg.channel.send('My creator is too tired to fix this rn');
	if (args[1].startsWith("d")){
		var dieValue = "";
		i = 1
		while(args[1][i] != null){
			dieValue += args[1][i];
			i++;
		}
		dieValue = parseInt(dieValue);
		dieValue = Math.floor(Math.random() * dieValue);
		return msg.channel.send(`You rolled a ${args[1]} and got ${dieValue}`);
	}

	//return msg.channel.send(`You want me to roll a ${sides}-sided die ${times} times... but I don't know how to do that yet.`);
	return msg.channel.send('This function is WIP. For now you should be able to do simple rolls like \'!roll d20\'');
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

// Invite this bot to your server!
// https://discord.com/oauth2/authorize?client_id=734224877195755600&scope=bot
const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./bot_config.json');


// When the bot succesfully logs in
client.on('ready', () => {
	client.user.setUsername(config.username);
	//client.user.setAvatar(config.avatar); // Discord doesn't like getting frequent avatar change requests
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
	sorry = msg.content.startsWith("!sorry");
	hate = (contains(msg.content, insults) && contains(msg.content,['elfbot','Elf bot','elfboy','elfbutt', 'elf butt']));

	if (roll){
		rollDice(msg);
	}
	if (flip || coin){
		args = msg.content.split(' ');
		coinFlip(msg, args[1]);
	}
	if (sorry){
		sorryElfBot(msg);
	}
	if (hate){
		elfBotIsPissed(msg);
	}
});

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

function rollDice(msg){
	// Ex. d20 | 4d20 | d6 + 9 | d6 + d9
	args = msg.content.split(" ");
	
	// '!roll'
	if (!args[1]) return msg.channel.send('Usage:\n\`!roll d20\`\n\`!roll 4d20\`\n\`!roll 4d20 + 6\`\n\`!roll 4d20 + 6d9\`');
	
	// '!roll #/d`
	value = 0;
	term = 1;
	statement = `${dice_shaking} ${dice_throwing} `;
	while(args[term] != null){
		if (args[term].includes('d')){
			[times,die_value] = args[term].split('d');
			times = parseInt(times);
			if (times > 128){
				times = 128;
				statement += `\n*The maximum dice you can roll is 128. Elf Bot can only roll so many...*\n`
			}
			if(isNaN(times)) times = 1;
			die_value = parseInt(die_value);
			statement += '[';
			for(i=1; i<=times; i++){
				outcome = (1 + Math.floor(Math.random() * die_value))
				value += outcome;
				if(i == times){
					statement += `**${outcome}**] + `;
					break;
				}
				statement += `**${outcome}** + `;
			}
		} else if( !isNaN(parseInt(args[term])) ){
			outcome = parseInt(args[term]);
			value += outcome;
			statement += `[**${outcome}**] + `;
		}
		term++;
	}
	statement = statement.substring(0,statement.length-2);
	statement += `\n***${value}***`;
	return msg.channel.send(statement);
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

function sorryElfBot(msg){
	flipValue = (Math.floor(Math.random() * 2) == 0);
	if (flipValue)
		outcome = `${elfbot_sad} You made so sad i don't know if I can forgive you...`;
	else
		outcome = `${elfbot_thankful} really? okay... hehe...`;
	return msg.channel.send(outcome);	
}

function contains(string, array){
	var value = 0;
	for (i in array){
		if(string.includes(array[i]))
			value = 1;
	}
	return value;
}

function elfBotIsPissed(msg){
	outcome = `${elfbot_pissed} `
	outcome += pissed[Math.floor(Math.random() * pissed.length)]
	return msg.channel.send(outcome);
}

var insults = [
	'fuck you',
	'i hate you',
	'is a turd',
	'you suck',
	'elf butt',
	'elfbutt'
]

var pissed = [
	`I'm trying my best okay...`,
	`Leave me alone...`,
	`You're hurting my feelings...`,
	'stop...',
	`**STOP**`,
	`I HAVE HAD ENOUGH`
]

client.login(config.token); // Let the bot log-in!

// Summons elfbot's custom emojis from the *Magical* Discord CDN
const dice_shaking = `<:dice_shaking:736084795871985675>` ;
const dice_throwing = `<:dice_throwing:736084796190490704>`;
const elfbot_sad = `<:elfbot_sad:736449977454428180>`;
const elfbot_thankful = `<:elfbot_thankful:736452545240760491>`;
const elfbot_pissed = `<:elfbot_pissed:736459175978074153>`;
require('dotenv').config();
const Discord = require('discord.js');
const bot = new Discord.Client();
const TOKEN = process.env.TOKEN;
const prefix = 'hw!';

bot.login(TOKEN);

// HP Variables
let hp = 0;
let hp_initialized = false;
let age_initialized = false;

// Texts
let race_text = `Hi! I am here to help you with your character's HP. First of all, is your character a dragon, non-dragon, dragonspawn or a drakonid? `;
let age_text = 'Is your dragon character a whelp, drake, matured dragon, wyrm or an elderwyrm? ';
let specialization_text = `Is your character a tank, healer, magic-user, long-range or a melee? `;
let result_text = 'Your final HP is ';
let error = "Error. Contact Jes."

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    bot.user.setPresence({
        status: "dnd", // You can show online, idle... Do not disturb is dnd
        game: {
            name: "hw!help || Heartwing", // The message shown
            type: "PLAYING" // PLAYING, WATCHING, LISTENING, STREAMING,
        }
    });
});

bot.on("message", async message => {
    // Ignore other bots
    if (message.author.bot) return;

    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    // if (!message.content.startsWith(prefix)) return;

    // Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const response_args = message.content.trim().split(/ + /g);
    const response = response_args.shift().toLowerCase();
    
   // Check if a role is being mentioned (only allow first mention)
   if(message.mentions.roles.first()) {
       // Change this id to be the role that is allowed to be mentioned
       if(message.mentions.roles.first().id === '603666294696574986') {
            console.log("Casual RP called!");
            message.guild.setIcon('https://i.imgur.com/45IdD3Z.jpg')
            // Time is set to 4 hours (milliseconds measurement)
            .then(updated => setTimeout(ResetIcon, 14400000))
            .catch(console.error);
        }
    }

    if (command === 'rpcancel') {
        ResetIcon();
    }

    if (!hp_initialized) {
        // Also good practice to ignore any message that does not start with our prefix, 
        // which is set in the configuration file.
        if (!message.content.startsWith(prefix)) return;
    }

    // Initialize
    if (command === 'hp') {
        if (!hp_initialized) {
            hp_initialized = true;
            message.author.send(race_text)

            setTimeout(ResetHP, 18000);
        }
    }

    // Other Commands
    if (command === 'help') {
        message.author.send("This is list of available Bot commands for Heartwing (use them in the Discord server): \n hw!hp \n hw!help \n hw!patch \n hw!dicemaster")
    }

    if (command === 'patch') {
        message.channel.send("You can download the Heartwing Patch at https://heartwing.dk/heartwing-patch/Heartwing.zip");
    }

    if (command === 'dicemaster') {
        message.channel.send("You can download DiceMaster at https://heartwing.dk/dicemaster/dicemaster.rar");
    }

    if (command === "downloads") {
        message.channel.send("You can download the Heartwing Patch here: https://heartwing.dk/heartwing-patch/Heartwing.zip \nDiceMaster can be downloaded here: https://heartwing.dk/dicemaster/dicemaster.rar");
    }

    // Count Members
    if (command === 'count') {
        let server = await message.guild.roles;
        let roleID = '218857694872731649';
        let memberCount = server.get(roleID).members.size;
        console.log(memberCount);
    }

    // Race Replies
    if (response === 'non-dragon') {
        if (hp_initialized) {
            hp = 35;
            age_initialized = false;
            is_dragon = false;
            SpecNext();
        } else {
            return;
        }
    }
    if (response === 'dragon') {
        if (hp_initialized) {
            hp = 0;
            age_initialized = true;
            is_dragon = true;
            message.author.send(age_text);
        } else {
            return;
        }
    }
    if (response === 'drakonid') {
        if (hp_initialized) {
            hp = 45;
            age_initialized = false;
            is_dragon = false;
            SpecNext();
        } else {
            return;
        }
    }
    if (response === 'dragonspawn') {
        if (hp_initialized) {
            hp = 40;
            age_initialized = false;
            is_dragon = false;
            SpecNext();
        } else {
            return;
        }
    }
    // Dragon Age Replies
    if (response === 'drake' || response === 'wyrm' || response === 'whelp' || response === 'matured' || response === 'matured dragon') {
        if (hp_initialized && age_initialized) {
            if (response === 'wyrm') {
                age = 90;
            } else if (response === 'drake') {
                age = 50;
            } else if (response === 'whelp') {
                age = 25;
            } else if (response === 'matured' || 'matured dragon') {
                age = 75;
            } else if (response === 'elder' || 'elder wyrm') {
                age = 200;
            }
            SpecNext();
        } else {
            return;
        }
    }

    // Specialization Replies
    if (
        response === 'tank' ||
        response === 'healer' ||
        response === 'melee' ||
        response === 'long range' ||
        response === 'long-range ' ||
        response === 'long' ||
        response === 'magic' ||
        response === 'magic-user' ||
        response === 'magic user'
    ) {
        if (hp_initialized && specialization_initialized) {
            // Tank Reply
            if (response === 'tank') {
                if (is_dragon && age_initialized) {
                    specialization = (hp + age) / 10 * 5;
                    message.author.send("Dragon: " + result_text + Math.round((hp + age + specialization) / 5) * 5);
                } 
                else {
                    specialization = hp / 10 * 5;
                    message.author.send("Mortal: " + result_text + Math.round((hp + specialization) / 5) * 5);
                }
                ResetHP();
            }
            // Healer Reply
            else if (response === 'healer') {
                specialization = -5;
                if (is_dragon && age_initialized) {
                    message.author.send("Dragon: " + result_text + (hp + age + specialization));
                } 
                else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
            // Melee Reply
            else if (response === 'melee') {
                specialization = 10;
                if (is_dragon && age_initialized) {
                    message.author.send("Dragon: " + result_text + (hp + age + specialization));
                } 
                else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
            // Magic Reply
            else if (response === 'magic user' || response === 'magic' || response === 'magic-user') {
                specialization = -5;
                if (is_dragon && age_initialized) {
                    message.author.send("Dragon: " + result_text + (hp + age + specialization));
                }
                else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
            // Long Range Reply
            else if (response === 'long range' || response == 'long' || response === 'long-range') {
                specialization = 0;
                if (is_dragon && age_initialized) {
                    message.author.send("Dragon: " + result_text + (age + specialization));
                } 
                else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
        } else {
            console.log("Error in specialization. Could not find hp_init, age_init, specialization_init");
            console.log("HP init " + hp_initialized);
            console.log("Age Init " + age_initialized);
            console.log("Spec Init " + specialization_initialized);
            return;
        }
    } else {
        return;
    }

    function SpecNext() {
        specialization_initialized = true;
        message.author.send(specialization_text);
    }

    function ResetHP() {
        hp_initialized = false;
        age_initialized = false;
        specialization_initialized = false;
        is_dragon = false;
    }

    function ResetIcon() {            
        message.guild.setIcon('https://i.imgur.com/jelQl3H.gif')
        .then(updated => console.log('Reverted to default'))
        .catch(console.error);
    }
});
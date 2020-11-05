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
let specialization_text = `Is your character a tank, healer, long-range or a melee? `;
let result_text = 'Your final HP is ';
let error = "Error. Contact Jes."

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
    bot.user.setActivity("Killing HW members");
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
    if (command === 'patch') {
        message.channel.send("You can download the Heartwing Patch at https://heartwing.dk/heartwing-patch/heartwing-patch.zip");
    }

    if (command === 'dicemaster') {
        message.channel.send("You can download DiceMaster at https://heartwing.dk/dicemaster/dicemaster.rar");
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
        response === 'long' ||
        response === 'magic' ||
        response === 'magic user'
    ) {
        if (hp_initialized && age_initialized && specialization_initialized) {
            // Tank Reply
            if (response === 'tank') {
                if (age_initialized) {
                    if (is_dragon) {
                        specialization = (hp + age) / 10 * 5;
                        message.author.send("Dragon: " + result_text + Math.round((hp + age + specialization) / 5) * 5);
                    } else {
                        specialization = hp / 10 * 5;
                        message.author.send("Mortal: " + result_text + Math.round((hp + specialization) / 5) * 5);
                    }
                    ResetHP();
                }
            }
            // Healer Reply
            else if (response === 'healer') {
                specialization = -5;
                if (age_initialized) {
                    if (is_dragon) {
                        message.author.send("Dragon: " + result_text + (hp + age + specialization));
                    } else {
                        message.author.send(error);
                    }
                } else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
            // Melee Reply
            else if (response === 'melee') {
                specialization = 10;
                if (age_initialized) {
                    if (is_dragon) {
                        message.author.send("Dragon: " + result_text + (hp + age + specialization));
                    } else {
                        message.author.send(error);
                    }
                } else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
            // Magic Reply
            else if (response === 'magic user' || response === 'magic') {
                specialization = -5;
                if (age_initialized) {
                    if (is_dragon) {
                        message.author.send("Dragon: " + result_text + (hp + age + specialization));
                    } else {
                        message.author.send(error);
                    }
                } else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
            // Long Range Reply
            else if (response === 'long range' || response == 'long') {
                specialization = 0;
                if (age_initialized) {
                    if (is_dragon) {
                        message.author.send("Dragon: " + result_text + (age + specialization));
                    } else {
                        message.author.send(error);
                    }
                } else {
                    message.author.send("Mortal: " + result_text + (hp + specialization));
                }
                ResetHP();
            }
        } else {
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
});
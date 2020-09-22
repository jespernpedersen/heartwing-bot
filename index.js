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
let race_text = 'Choose your race ';
let age_text = 'Choose your age ';
let specialization_text = 'Choose your specialization ';
let result_text = 'Your final HP is ';

bot.on('ready', () => {
    console.info(`Logged in as ${bot.user.tag}!`);
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

    if (!hp_initialized) {
        // Also good practice to ignore any message that does not start with our prefix, 
        // which is set in the configuration file.
        if (!message.content.startsWith(prefix)) return;
    }

    // Initialize
    if (command === 'hp') {
        if (!hp_initialized) {
            hp_initialized = true;
            message.reply(race_text)
        }
    }

    // Race Replies
    if (message.content === 'Dragon') {
        if (hp_initialized) {
            // Set Variable
            hp = 25;
            // Allow Next Condition
            age_initialized = true;
            is_dragon = true;
            // Send Reply
            message.reply(age_text);
        } else {
            return;
        }
    }

    // Age Replies
    if (message.content === 'Wyrm') {
        if (hp_initialized && age_initialized) {
            // Set Variable
            age = 65;
            // Allow Next Condition
            specialization_initialized = true;
            // Send Reply
            message.reply(specialization_text);
        } else {
            return;
        }
    }

    // Specialization Replies
    if (message.content === 'Tank') {
        if (hp_initialized && age_initialized && specialization_initialized) {
            if (age_initialized) {
                // Send Final Reply
                if (is_dragon) {
                    // Set Variable
                    specialization = (hp + age) / 10 * 5;
                    message.reply("Dragon: " + result_text + Math.round((hp + age + specialization) / 5) * 5);
                } else {
                    specialization = hp / 10 * 5;
                    message.reply("Mortal: " + result_text + Math.round((hp + specialization) / 5) * 5);
                }
                // Reset
                ResetHP();
            }
        } else {
            return;
        }
    }

    function ResetHP() {
        hp_initialized = false;
        age_initialized = false;
        specialization_initialized = false;
        is_dragon = false;
    }
});
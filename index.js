require('dotenv').config();

const { Client, Collection, MessageEmbed } = require('discord.js');
const bot = new Client();

const PREFIX = '$'

const fs = require('fs');

bot.commands = new Collection();

// Command Files
const commandFiles = fs.readdirSync('./commands/')
                       .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);

    bot.commands.set(command.name, command);
}

bot.on("ready", () => {
    console.log(`${bot.user.username} is Online`)
});

bot.on("message", (message) => {
    if (!message.content.startsWith(PREFIX) || message.author.bot) return;

    const [command, ...args] = message.content
        .trim()
        .substring(PREFIX.length)
        .split(/\s+/);

    if (command === "test") {
        bot.commands.get('test')
            .execute(message, args);
    }
})

bot.on("guildMemberAdd", async member => {
    let channel = member.guild.channels.cache.find(c => c.name === 'welcome')
    let WELCOME = new MessageEmbed()
        .setTitle(`Hello, New User!`)
        .setDescription(`Welcome to DEFAULT Discord Channel ${member.user}, we are happy to have you!`)
        .setColor('RANDOM')
        .setTimestamp()
        .setFooter('Thanks For Joining!')
    channel.send(WELCOME)
})

bot.login(process.env.TOKEN);

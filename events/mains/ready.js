const { Client, Collection, ActivityType, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, MessageAttachment, ButtonStyle, Message } = require("discord.js");
const process = require('process');
const { joinVoiceChannel } = require('@discordjs/voice');
const { voiceRoomID } = require('../../config.json')

module.exports = {
    name: Events.ClientReady,
    once: true,
    /**
     * @param {Client} client
     */
    execute(client) {
        client.user.setStatus("idle");
        console.log(`Ready! Logged in as ${client.user.tag} , My ID : ${client.user.id}`);

        setInterval(async () => {
            client.channels.fetch("1249586917125656586")
                .then((channel) => {
                    const VoiceConnection = joinVoiceChannel({
                        channelId: channel.id,
                        guildId: channel.guild.id,
                        adapterCreator: channel.guild.voiceAdapterCreator
                    });
                }).catch((error) => { return; });
        }, 1000);

        let lastCpuUsage = process.cpuUsage();
        let lastTime = process.hrtime();
        let i = 0;

        setInterval(() => {
            // Get memory usage
            const heapUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // in MB
            const totalMemory = (process.memoryUsage().rss / 1024 / 1024).toFixed(2); // in MB
            const memoryUsagePercent = ((heapUsed / totalMemory) * 100).toFixed(2);

            // Get current CPU usage
            const currentCpuUsage = process.cpuUsage(lastCpuUsage);
            const currentTime = process.hrtime(lastTime);

            // Calculate the time difference in seconds
            const timeDiff = currentTime[0] + currentTime[1] / 1e9;

            // Calculate the CPU usage percentage
            const userCpuUsage = currentCpuUsage.user / 1e6; // Convert to milliseconds
            const systemCpuUsage = currentCpuUsage.system / 1e6; // Convert to milliseconds
            const totalCpuUsage = userCpuUsage + systemCpuUsage; // Total CPU usage in milliseconds
            const cpuUsagePercent = ((totalCpuUsage / (timeDiff * 1000)) * 100).toFixed(2);

            let activities = [`Bot Maker`, `RAM : ${memoryUsagePercent}%`, `CPU : ${cpuUsagePercent}%`];
            client.user.setActivity({ name: `${activities[i++ % activities.length]}`, type: ActivityType.Competing });

            // Update lastCpuUsage and lastTime for the next interval
            lastCpuUsage = process.cpuUsage();
            lastTime = process.hrtime();
        }, 5000);
    },
};
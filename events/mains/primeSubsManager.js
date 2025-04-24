const { Client, Collection, ActivityType, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandOptionType, Events, ActionRowBuilder, ButtonBuilder, MessageAttachment, ButtonStyle, Message } = require("discord.js");
const { Database } = require("st.db");
const tier1subscriptions = new Database("/database/makers/tier1/subscriptions");
const usersdata = new Database(`/database/usersdata/usersdata`);
const mainBot = require('../../index');
const prettySeconds = require('pretty-seconds');
const AsciiTable = require('ascii-table');
const { WebhookClient } = require('discord.js')
const { makerSubsLogsWebhookUrl } = require('../../config.json');
const webhookClient = new WebhookClient({ url : makerSubsLogsWebhookUrl });

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        const updateSubscriptions = async () => {
            let subscriptions1 = tier1subscriptions.get(`tier1_subs`);
            if (!subscriptions1) return;

            subscriptions1.forEach(async (subscription) => {
                let { ownerid, guildid, timeleft } = subscription;
                let theguild = client.guilds.cache.get(guildid);

                if (timeleft > 0) {
                    timeleft -= 1;
                    subscription.timeleft = timeleft;
                    await tier1subscriptions.set(`tier1_subs`, subscriptions1);

                    if (timeleft === 259200) {
                        await client.users.fetch(ownerid);
                        let theowner = client.users.cache.get(ownerid);
                        const warnEmbed = new EmbedBuilder()
                            .setTitle(`🔔 تنبيه باقتراب انتهاء الاشتراك 🔔`)
                            .setColor('Yellow')
                            .setDescription(`** مرحبًا [${theowner.username}]،\nنود إبلاغك بأن انتهاء اشتراك بوت الميكر البرايم الخاص بك لسيرفر \`${theguild.name}\` سيكون خلال 3 أيام.\nيرجى التفكير في تجديد الاشتراك قبل انتهاء المدة لضمان استمرار الخدمة.\nشكرًا لتفهمك!**`)
                            .setTimestamp();
                        await theowner.send({ embeds: [warnEmbed] }).catch(() => { });
                        await webhookClient.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`🔔 تنبيه باقتراب انتهاء الاشتراك 🔔`)
                                        .setColor('Yellow')
                                        .addFields(
                                            { name: `الاشتراك :`, value: `\`\`\`برايم\`\`\``, inline: true },
                                            { name: `السيرفر`, value: `\`\`\`${guildid} [${theguild.name}]\`\`\``, inline: true },
                                            { name: `صاجب الاشتراك`, value: `\`\`\`${ownerid}\`\`\``, inline: true },
                                            { name: `الوقت المتبقي :`, value: `\`\`\`${prettySeconds(timeleft)}\`\`\``, inline: true }
                                        )
                                        .setTimestamp()
                                ]
                            }).catch((err) => { });
                    }

                    if (timeleft === 0) {
                        const updatedSubs = subscriptions1.filter(sub => sub.guildid !== guildid);
                        await tier1subscriptions.set(`tier1_subs`, updatedSubs);
                        let endedEmbed = new EmbedBuilder()
                            .setColor('Red')
                            .setTitle(`**❌انتهي وقت الاشتراك❌**`)
                            .setTimestamp()
                            .setDescription(`**انتهى اشتراك بوت الميكر الخاص بك لسيرفر : \`${theguild.name}\`** \n \n \`\`\`شكرًا لاختيارك خدماتنا! نحن نقدر دعمك وثقتك بنا\`\`\``);
                        await client.users.fetch(ownerid);
                        let theowner = client.users.cache.get(ownerid);
                        await theowner.send({ embeds: [endedEmbed] });

                        await webhookClient.send({
                                embeds: [
                                    new EmbedBuilder()
                                        .setTitle(`🚨 **تنبيه بانتهاء الاشتراك** 🚨`)
                                        .setColor('Red')
                                        .addFields(
                                            { name: `الاشتراك :`, value: `\`\`\`برايم\`\`\``, inline: true },
                                            { name: `السيرفر`, value: `\`\`\`${guildid} [${theguild.name}]\`\`\``, inline: true },
                                            { name: `صاجب الاشتراك`, value: `\`\`\`${ownerid}\`\`\``, inline: true },
                                            { name: `الوقت المتبقي :`, value: `\`\`\`${prettySeconds(timeleft)}\`\`\``, inline: true }
                                        )
                                        .setTimestamp()
                                ]
                            }).catch((err) => { });
                        
                        await theguild.leave();
                        await usersdata.delete(`sub_${ownerid}`);
                    }
                }
            });
        };
        setTimeout(async() => {
            let subscriptions1 = tier1subscriptions.get(`tier1_subs`);
            if(subscriptions1){
                const displayTable = (subscriptions) => {
                    const table = new AsciiTable('Prime makers');
                    table.setHeading('', 'Guild ID', 'Owner ID', 'Time Left', 'Status');

                    subscriptions.forEach((subscription, index) => {
                        const { ownerid, guildid, timeleft } = subscription;
                        const status = timeleft > 0 ? '🟢 ONLINE' : '🔴 OFFLINE';
                        table.addRow(index + 1, guildid, ownerid, prettySeconds(timeleft), status);
                    });

                    console.log(table.toString())
                };
                displayTable(subscriptions1);   
            }
        }, 15_000);

        setInterval(updateSubscriptions, 1000);
    },
};
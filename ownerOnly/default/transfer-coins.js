const { ChatInputCommandInteraction , Client , SlashCommandBuilder, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const usersdata = new Database(`/database/usersdata/usersdata`)
const { createCanvas, loadImage, registerFont } = require('canvas');
const { mainguild , commandsRoom} = require('../../config.json');

module.exports ={
    ownersOnly:false,
    data: new SlashCommandBuilder()
    .setName('transfer-coins')
    .setDescription('تحويل رصيد الى شخص')
    .addUserOption(Option => Option
        .setName(`user`)
        .setDescription(`الشخص المراد تحويل الرصيد اليه`)
        .setRequired(true))
        .addIntegerOption(Option => Option
            .setName(`quantity`)
            .setDescription(`الكمية`)
            .setRequired(true)),
    /**
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if(interaction.guild.id == mainguild && interaction.channel.id !== commandsRoom) return interaction.reply({content : `** جميع الاوامر هنا <#${commandsRoom}> **` , ephemeral : true})

        await interaction.deferReply();
        let balanceembed = new EmbedBuilder().setTimestamp()
        let user = interaction.options.getUser(`user`)
        let quantity = interaction.options.getInteger(`quantity`)
        let authorbalance = usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`)
        let userbalance = usersdata.get(`balance_${user.id}_${interaction.guild.id}`);
        if(!userbalance) {
            await usersdata.set(`balance_${user.id}_${interaction.guild.id}` , 0)
        }
        if(!authorbalance) {
            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , 0)
        }
        authorbalance = await usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`)
        userbalance = await usersdata.get(`balance_${user.id}_${interaction.guild.id}`);
        if(authorbalance < quantity) {
            balanceembed.setTitle(`**ليس لديك الرصيد الكافي لإجراء هذا التحويل**`)
            balanceembed.setColor('Red')
            return interaction.editReply({embeds:[balanceembed]})
        }

        if(user.bot) {
            balanceembed.setTitle(`**لا يمكنك نقل الرصيد إلى البوتات**`)
            balanceembed.setColor('Red')
            return interaction.editReply({embeds:[balanceembed]})
        }

        if(user.id == interaction.user.id) {
            balanceembed.setTitle(`**لا يمكنك تحويل الرصيد إلى حسابك الخاص**`)
            balanceembed.setColor('Red')
            return interaction.editReply({embeds:[balanceembed]})
        }

        if(quantity <= 0 || isNaN(quantity)) {
            balanceembed.setTitle(`**غير مسموح لك بتحويل الرصيد بكميات غير صالحة**`)
            balanceembed.setColor('Red')
            return interaction.editReply({embeds:[balanceembed]})
        }

        let newauthorbalance = parseInt(authorbalance) - parseInt(quantity)
        let newuserbalance = parseInt(userbalance) + parseInt(quantity)
        function generateRandomNumber(n) {
            const captchaNumber = [];
            for (let i = 0; i < n; i++) {
                captchaNumber.push(Math.floor(Math.random() * 10));
            }
            return captchaNumber;
        }

        const ax = interaction.user.id
        const captcha = generateRandomNumber(4).join("")

        balanceembed.setColor('Grey')
        balanceembed.setTitle('الرجاء كتابة الارقام التالية لتأكيد العملية')
        balanceembed.setImage(`https://dummyimage.com/300x110/33363c/ffffff&text=${captcha}`)
        const sent = await interaction.editReply({embeds : [balanceembed]})

        let collectorFilter = (i) => (i.author.id == interaction.user.id)
        const collect = await interaction.channel.createMessageCollector({
            filter: collectorFilter,
            max: 1,
            time: 15 * 1000
        });

            let collected = false;
            collect.on("collect" , async(msg) => {
                try {
                    if(msg.content == captcha) {
                        collected = true;
                        await usersdata.set(`balance_${user.id}_${interaction.guild.id}` , newuserbalance)
                        await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}` , newauthorbalance)
                        balanceembed.setTitle(`**تم تحويل \`${quantity}\` من الرصيد بنجاح**`)
                        balanceembed.setDescription(`**رصيدك الحالي هو : \`${newauthorbalance}\`\n رصيد ${user} الحالي هو : \`${newuserbalance}\`**`)
                        balanceembed.setImage(null)
                        balanceembed.setColor('Green')
                        await msg.delete();
                        await sent.delete();
                        return interaction.channel.send({content:`<@${ax}>`,embeds:[balanceembed]})
                    } else {
                        await msg.delete();
                        return sent.delete();
                    }
                } catch {
                    return;
                }
               
            })

            collect.on("end" , async(msg) => {
                if(collected == false){
                    await msg.delete();
                    return sent.delete();
                }
            })
            
 
    }
}
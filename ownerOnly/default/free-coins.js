const { SlashCommandBuilder, Collection, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const usersdata = new Database(`/database/usersdata/usersdata`);
const freeCooldownsDB = new Database(`/Json-db/Others/freeCoinsCooldown`);
let { mainguild , commandsRoom } = require(`../../config.json`);

module.exports = {
    ownersOnly: false,
    data: new SlashCommandBuilder()
        .setName('free-coins')
        .setDescription(`الحصول على كوينز مجانية`),
    async execute(interaction, client) {
        try {
            if(interaction.guild.id == mainguild && interaction.channel.id !== commandsRoom) return interaction.reply({content : `** جميع الاوامر هنا <#${commandsRoom}> **` , ephemeral : true})

            await interaction.deferReply({ ephemeral: false });
                // التحقق اذا استلم الشخص كوينز مجانا قبل 12 ساعة
                // اذا استلم بالفعل
                const cooldownTimestamp = await freeCooldownsDB.get(`cooldown_${interaction.user.id}_${interaction.guild.id}`);
                const currentTime = Date.now();
                const cooldownDuration = 1000 * 60 * 60 * 12; // 12 hours in milliseconds
    
                if (cooldownTimestamp && (currentTime - cooldownTimestamp) < cooldownDuration) {
                    return interaction.editReply({ content: `**يمكنك استخدام الامر مرة كل 12 ساعة فقط**` });
                }
                // اذا لم يستلم
                else{
                // جلب بعض المعلومات
                let userbalance = await usersdata.get(`balance_${interaction.user.id}_${interaction.guild.id}`) ?? 0;
    
                function getRandomInt() {
                    const random = Math.random();
                    if (random < 0.8) {
                        return Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
                    } else {
                        return Math.floor(Math.random() * 2) + 4; // 4 or 5
                    }
                }
    
                function generateFourDigitNumber() {
                    return Math.floor(1000 + Math.random() * 9000);
                }
    
                const randomNum = getRandomInt();
                const captcha = generateFourDigitNumber();

                // جامع الرسائل

                const sent = await interaction.editReply({embeds : [new EmbedBuilder().setTitle('الرجاء كتابة الارقام التالية لتأكيد العملية').setImage(`https://dummyimage.com/300x110/33363c/ffffff&text=${captcha}`)]})

                let collectorFilter = (i) => (i.author.id == interaction.user.id)
                const collect = await interaction.channel.createMessageCollector({
                    filter:collectorFilter,
                    max: 1,
                    time: 15 * 1000
                });

                let collected = false;
                collect.on("collect" , async(msg) => {
                    if(msg.content == captcha){
                        collected = true;
                        if (!await usersdata.has(`balance_${interaction.user.id}_${interaction.guild.id}`)) {
                            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}`, randomNum);
                            let embed1 = new EmbedBuilder()
                                .setTitle(`**تم الحصول على هدية مجانية قدرها ${randomNum}**`)
                                .setDescription(`**رصيدك الحالي هو : \`${randomNum}\`**`)
                                .setTimestamp();
                            await freeCooldownsDB.set(`cooldown_${interaction.user.id}_${interaction.guild.id}`, currentTime);
                            await sent.delete();
                            return interaction.channel.send({content : `<@${interaction.user.id}>` , embeds: [embed1] });
                        } else {
                            let newUserBalance = parseInt(userbalance) + parseInt(randomNum);
                            await usersdata.set(`balance_${interaction.user.id}_${interaction.guild.id}`, newUserBalance);
                            let embed1 = new EmbedBuilder()
                                .setTitle(`**تم الحصول على هدية مجانية قدرها ${randomNum}**`)
                                .setDescription(`**رصيدك الحالي هو : \`${newUserBalance}\`**`)
                                .setTimestamp();
                            await freeCooldownsDB.set(`cooldown_${interaction.user.id}_${interaction.guild.id}`, currentTime);
                            await sent.delete();
                            return interaction.channel.send({content : `<@${interaction.user.id}>` , embeds: [embed1] });
                        }   
                    }else{
                        await msg.delete();
                        return sent.delete();
                    }
                })

                collect.on("end" , async(msg) => {
                    if(collected === false){
                        await msg.delete();
                        return sent.delete();
                    }
                })
                }            
        } catch (error) {
            console.error(error);
            return interaction.editReply({ content: `**حدث خطأ حاول مرة اخرى**` });
        }
    }
};
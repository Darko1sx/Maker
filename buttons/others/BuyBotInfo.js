const { Interaction , SlashCommandBuilder,TextInputStyle,TextInputBuilder,ModalBuilder,Events, EmbedBuilder , PermissionsBitField, ActionRowBuilder,ButtonBuilder,MessageComponentCollector,ButtonStyle } = require("discord.js");
const { Database } = require("st.db");
const setting = new Database("/database/settingsdata/setting")
module.exports = {
  name: Events.InteractionCreate,
    /**
    * @param {Interaction} interaction
  */
  async execute(interaction){
    if(interaction.isButton()) {
        if(interaction.customId == "buyBotInfo") {
            await interaction.deferReply({ephemeral : true});

            const embed = new EmbedBuilder()
                                    .setColor('White')
                                    .setTitle('شروط الخدمة')
                                    .setDescription(`**- يُمنع استخدام البوتات لأي نشاط غير قانوني أو ينتهك سياسات ديسكورد.
- سيتم تحديث البوتات بانتظام لتصحيح الأخطاء وإضافة ميزات جديدة، دون أي تكلفة إضافية على المستخدمين.
- سيتم إشعار العملاء مسبقًا بأي تحديثات أو صيانة مجدولة قد تؤثر على الخدمة.
- نحن ملتزمون بسرية معلومات العملاء ولن نقوم ببيع أو مشاركة البيانات مع أطراف ثالثة دون موافقة مسبقة من العميل.
- يجب على المستخدمين الالتزام بسياسة الاستخدام العادل وعدم استغلال الخدمة بشكل مفرط يؤثر على أداء البوتات أو الخدمة المقدمة للآخرين.
- بعض الميزات قد تكون محدودة وفقًا لنوع الاشتراك المختار. للحصول على ميزات إضافية، يمكن ترقية الاشتراك إلى خطة أعلى.
- لن يتم استرداد أي مبالغ مدفوعة بعد إتمام عملية الشراء، إلا في حالات استثنائية وبعد مراجعة فريق الدعم الفني.
- في حالة شراء بوت برودكاست لا يمكننا تعويضك تبنيد بوتك.
- لا نتحمل مسؤولية عدم فتح خاصك قبل شراء اي بوت.
- نحتفظ بالحق في إيقاف أي بوت دون سابق إنذار في حال انتهاك أي من شروط الخدمة.**`)
                                    .setAuthor({name : interaction.guild.name , iconURL : interaction.guild.iconURL({dynamic : true})})
                                    .setFooter({text : `Last Update : 06/06/2024` , iconURL : interaction.client.user.displayAvatarURL({dynamic : true})});
            
            await interaction.editReply({embeds : [embed]})
        }
    }
}
};
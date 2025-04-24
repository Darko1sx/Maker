const mongoose = require("mongoose")
const {client , guildid} = require("../index")
const { EmbedBuilder} = require('discord.js')
let Schema = new mongoose.Schema({
    guildid:{
        type:String,
        default:guildid
    },
    panelId:{
        type:Number,
        default:0,
    },
    panelCategory:{
        type:String,
    },
    panelRole:{
        type:String,
    },
    panelWelcome:{
        type:String
    },
    panelName:{
        type:String,
    },
    panelDescription:{
        type:String,
    },
    panelNumber:{
        type:String,
        default:1,
    },
    
});
module.exports = mongoose.model('panels' , Schema)
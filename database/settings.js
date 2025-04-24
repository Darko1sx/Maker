const mongoose = require("mongoose")
const {client , guildid} = require("../index")
const { EmbedBuilder} = require('discord.js')
let Schema = new mongoose.Schema({
    guildid:{
        type:String,
        default:guildid
    },
    panelsRoom:{
        type:String,
    },
    transcripts:{
        type:String,
    },
   	paneltext:{
	type:String,
    }
});
module.exports = mongoose.model('setting' , Schema)
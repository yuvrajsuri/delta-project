const { time } = require('console');
const { date, number, required } = require('joi');
const mongoose = require('mongoose');
const { type } = require('os');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    username : {
        type : String,
        required : true
    },
    guest : {
        type : Number,
        min:1,
        max:5,
        required : true

    },
    from : {
        type : Date,
        required : true
    },
    to : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required : true
    },
    contact : {
        type : Number,
        required : true
    }, 
    rate : {
        type : String,
        required : true
    }
});

module.exports = mongoose.model("Book",bookSchema);

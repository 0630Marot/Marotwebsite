const mongoose = require('mongoose');
let MainSchema = new mongoose.Schema({
    index: Number,
    word: String,
    description:String,
});
let _MainSchema = mongoose.model('words', MainSchema);
module.exports=_MainSchema;

const mongoose = require('mongoose');
let MainSchema = new mongoose.Schema({
    index: Number,
    word: String,
    description:String,
    count: Number,
});
let _MainSchema = mongoose.model('words', MainSchema);
module.exports=_MainSchema;
// _MainSchema.findOne({ _id: '64b88fb2779ce6378cee1f66' }).then(data => {
//     console.log(data.count);
// })
const mongoose = require('mongoose');
let MainSchema = new mongoose.Schema({
    permission:String,
    host:Number,
    creatTime:Date,
},{
    timestamps: true
});
let _MainSchema = mongoose.model('invites', MainSchema);
module.exports=_MainSchema;

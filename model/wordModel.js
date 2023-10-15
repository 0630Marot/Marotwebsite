const mongoose = require('mongoose');
let MainSchema = new mongoose.Schema({
    permission: String,
    owner: String,
    dicname: String,
    word: [String],
});
let _MainSchema = mongoose.model('dictionaries', MainSchema);
module.exports = _MainSchema;

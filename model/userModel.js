const mongoose = require('mongoose');
let MainSchema = new mongoose.Schema({
    index: Number,
    username: String,
    password: String,
    email: String,
    permission: String,
    EnglishCount: [Number],
}, {
    timestamps: true
});
let _MainSchema = mongoose.model('users', MainSchema);
module.exports = _MainSchema;

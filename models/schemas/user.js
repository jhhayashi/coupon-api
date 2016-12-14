const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    classYear: Number,
    email: String,
    phone: {type: String, required: true},
    phoneProvider: {type: String, required: true},
    interests: [Number],
    isAdmin: {type: Boolean, index: true},
    isSuperAdmin: {type: Boolean, index: true},
});

var User = mongoose.model('User', userSchema);

module.exports = User;

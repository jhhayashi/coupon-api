const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: String,
    lastName: String,
    classYear: Number,
    email: String,
    phone: String,
    phoneProvider: String,
    interests: [Number],
    isAdmin: {type: Boolean, index: true},
    isSuperAdmin: {type: Boolean, index: true},
    hash: String,
});

// ensure phone and provider if not admin, hash if admin
userSchema.pre('save', function(callback) {
    if (this.Admin || this.isSuperAdmin) {
        if (!this.hash)
            return callback(new Error('No password'));
    } else {
        if (!this.phone)
            return callback(new Error('No phone'));
        if (!this.phoneProvider)
            return callback(new Error('No phoneProvider'));
    }
    callback();
});

userSchema.virtual('name').get(function() {
    var name = "";
    if (this.firstName) {
        name = this.firstName;
        if (this.lastName) name += ' ' + this.lastName;
    } else if (this.lastName) name = this.lastName;
    return name;
});

var User = mongoose.model('User', userSchema);

module.exports = User;

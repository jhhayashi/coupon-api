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

userSchema.virtual('name').get(() => {
    var name = "";
    if (this.firstName) {
        name = this.firstName;
        if (this.lastName) name += ' ' + lastName;
    } else if (this.lastName) name = this.lastName;
    return name;
});

var User = mongoose.model('User', userSchema);

module.exports = User;

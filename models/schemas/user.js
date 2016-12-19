const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const validator = require('email-validator');

var userSchema = new Schema({
        firstName: {type: String, trim: true},
        lastName: {type: String, trim: true},
        classYear: Number,
        email: {type: String, unique: true, sparse: true, trim: true},
        phone: {type: String, unique: true, dropDups: true},
        phoneProvider: {type: String, trim: true},
        interests: [Number],
        isAdmin: {type: Boolean, index: true},
        isSuperAdmin: {type: Boolean, index: true},
        hash: String,
    },
    {
        toObject: { getters: true },
        timestamps: {
            createdAt: 'createdDate',
            updateAt: 'updatedDate'
        },
    }
);

// hash if admin, ensure phone and provider if not
userSchema.pre('save', function(callback) {
    if (this.isAdmin || this.isSuperAdmin) {
        if (!this.email)
            return callback(new Error('No email'));
        if (!this.hash)
            return callback(new Error('No password'));
        if (this.isModified('hash'))
            this.hash = bcrypt.hashSync(this.hash);
    }

    else {
        if (!this.phone)
            return callback(new Error('No phone'));
        if (!this.phoneProvider)
            return callback(new Error('No phoneProvider'));
    }

    if (this.email && !validator.validate(this.email))
        return callback(new Error('Invalid email'));

    // validate phone
    if (typeof this.phone !== 'string')
        return callback(new Error('Invalid phone'));
    var phone = '';
    for (var i = 0; i < this.phone.length; i++) {
        if (!isNaN(this.phone[i]))
            phone += this.phone[i];
    }
    if (phone.length !== 10)
        return callback(new Error('Invalid phone'));
    this.phone = phone;

    callback();
});

// create full name
userSchema.virtual('name').get(function() {
    var name = "";
    if (this.firstName) {
        name = this.firstName;
        if (this.lastName) name += ' ' + this.lastName;
    } else if (this.lastName) name = this.lastName;
    return name;
});

// methods for validating password
userSchema.methods.comparePassword = function(pw, callback) {
    bcrypt.compare(pw, this.hash, (err, isMatch) => {
        if (err) return callback(err);
        callback(null, isMatch);
    });
};
userSchema.methods.comparePasswordSync = function(pw) {
    return bcrypt.compareSync(pw, this.hash);
};

var User = mongoose.model('User', userSchema);

module.exports = User;

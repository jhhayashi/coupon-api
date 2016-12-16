const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

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

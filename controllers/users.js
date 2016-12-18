const User = require('../models/schemas/user');

exports.getAllUsers = (req, res, next) => {
    User.find({}, (err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

exports.getUserById = (req, res, next) => {
    User.findById(req.params.id).select('-interests').exec((err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        res.json(user);
    });
};

exports.getUsersWithPhones = (req, res, next) => {
    User.find({phone: {$exists: true}}, (err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

// TODO auth
exports.createUser = (req, res, next) => {
    if (typeof req.body.phone !== 'string')
        return res.status(400).send('No phone');
    if (typeof req.body.phoneProvider != 'string')
        return res.status(400).send('No phoneProvider');

    var userData = {phoneProvider: req.body.phoneProvider};
    if (req.body.firstName && typeof req.body.firstName === 'string')
        userData.firstName = req.body.firstName;
    if (req.body.lastName && typeof req.body.lastName === 'string')
        userData.lastName = req.body.lastName;
    if (typeof req.body.classYear === 'number')
        userData.classYear = req.body.classYear;

    // validate phone
    var phone = '';
    for (var i = 0; i < req.body.phone.length; i++) {
        if (!isNaN(req.body.phone[i]) && req.body.phone[i] !== ' ')
            phone += req.body.phone[i];
    }
    if (phone.length !== 10)
        return res.status(400).send('Invalid phone');
    userData.phone = phone;

    // validate email
    // http://emailregex.com
    if (req.body.email) {
        if (!(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email)))
            return res.status(400).send('Invalid email');
        else
            userData.email = req.body.email;
    }

    if (req.body.interests)
        userData.interests = req.body.interests;
    if (req.body.isAdmin)
        userData.isAdmin = !!req.body.isAdmin;
    if (req.body.isSuperAdmin)
        userData.isSuperAdmin = !!req.body.isSuperAdmin;
    if (req.body.password)
        userData.hash = req.body.password;
    if (req.body.hash)
        userData.hash = req.body.hash;

    var newUser = new User(userData);
    newUser.save((err, user) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

// TODO validation
exports.updateUser = (req, res, next) => {
    User.findOneAndUpdate(req.params.id, req.body, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        return res.sendStatus(200);
    });
};

// TODO auth
exports.deleteUserById = (req, res, next) => {
    User.findOneAndRemove(req.params.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        return res.sendStatus(200);
    });
};

// TODO auth
exports.deleteUserByPhone = (req, res, next) => {
    User.findOneAndRemove({phone: req.params.phone}, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(404).send('No user with that ID');
        return res.sendStatus(200);
    });
};

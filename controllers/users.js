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
    // TODO find non-null
    User.find({}, (err, users) => {
        if (err) return next(err);
        res.json(users);
    });
};

// TODO auth, validation
exports.createUser = (req, res, next) => {
    var newUser = new User(req.body);
    newUser.save((err, user) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

// TODO
exports.updateUser = (req, res, next) => {
    return res.sendStatus(200);
};

// TODO
exports.deleteUserById = (req, res, next) => {
    return res.sendStatus(200);
};

// TODO
exports.deleteUserByPhone = (req, res, next) => {
    return res.sendStatus(200);
};

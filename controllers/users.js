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

// TODO auth, validation
exports.createUser = (req, res, next) => {
    var newUser = new User(req.body);
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

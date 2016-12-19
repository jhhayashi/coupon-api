const User = require('../models/schemas/user');
const jwt = require('jwt-simple');
const config = require('../models/config');

exports.loginUser = (req, res, next) => {
    if (typeof req.body.email !== 'string')
        return res.status(400).send('No email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('No password');

    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(400).send('No user with that email');
        if (!user.isAdmin && !user.isSuperAdmin)
            return res.status(403).send('No admin wih that email');
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.status(401).send('Incorrect password');
            var payload = user;
            var token = jwt.encode(payload, config.secret);
            res.json({token});
        });
    });
};

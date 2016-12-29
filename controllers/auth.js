const User = require('../models/schemas/user');
const jwt = require('jwt-simple');
const config = require('../models/config');

exports.loginUser = (req, res, next) => {
    if (typeof req.body.email !== 'string')
        return res.status(400).send('Missing email');
    if (typeof req.body.password !== 'string')
        return res.status(400).send('Missing password');

    User.findOne({email: req.body.email}, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(400).send('No user with that email');
        if (!user.isAdmin && !user.isSuperAdmin)
            return res.status(403).send('No admin wih that email');
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (err) return next(err);
            if (!isMatch)
                return res.status(401).send('Incorrect password');

            // add relevant data to token
            var payload = {
                id: user._id,
                email: user.email,
                companyName: user.companyName,
            };
            if (user.firstName) payload.firstName = user.firstName;
            if (user.lastName) payload.lastName = user.lastName;
            if (user.isAdmin) payload.isAdmin = user.isAdmin;
            if (user.isSuperAdmin) payload.isSuperAdmin = user.isSuperAdmin;

            var token = jwt.encode(payload, config.secret);
            user.token = token;
            user.save((err) => {
                if (err) return next(err);
                res.json({token});
            });
        });
    });
};

exports.adminRequired = (req, res, next) => {
    validateToken(req, res, next, {adminRequired: true});
};

exports.superAdminRequired = (req, res, next) => {
    validateToken(req, res, next, {superAdminRequired: true});
};

function validateToken(req, res, next, c) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) return res.status(403).send('Admin privileges required');

    try {
        var decoded = jwt.decode(token, config.secret);
    } catch(err) {
        return res.status(403).send('Failed to authenticate token');
    }

    if (c.adminRequired && !decoded.isAdmin && !decoded.isSuperAdmin)
        return res.status(403).send('Admin privileges required');
    if (c.superAdminRequired && !decoded.isSuperAdmin)
        return res.status(403).send('Superadmin privileges required');

    if (!decoded.id) return res.status(403).send('Invalid token');

    User.findById(decoded.id, (err, user) => {
        if (err) return next(err);
        if (!user) return res.status(403).send('Invalid user ID');
        if (token !== user.token) return res.status(403).send('Expired token');
        if (decoded.isAdmin != user.isAdmin || decoded.isSuperAdmin != user.isSuperAdmin)
            return res.status(403).send('Expired token');
        req.user = decoded;
        next();
    });
}

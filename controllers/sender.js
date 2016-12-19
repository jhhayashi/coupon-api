const nodemailer = require('nodemailer');
const User = require('../models/schemas/user');
const Coupon = require('../models/schemas/coupon');
const config = require('../models/config');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: config.emailFromAddress,
        pass: config.emailPassword
    }
});

exports.sendAllCouponsToAllUsers = (req, res, next) => {
    var now = new Date();
    Promise.all([
        User.find({phone: {$exists: true}}),
        Coupon.find({
            $and: [
                { startDate: {$lt: now} },
                { $or: [
                    { endDate: {$gt: now} },
                    { endDate: {$exists: false} },
                ]}
            ]
        })
    ])
    .then((values) => {
        if (!values[0].length || !values[1].length)
            return res.sendStatus(200);
        var users = values[0];
        var coupons = values[1];

        // build list of emails
        var emails = [];
        for (var i = 0; i < users.length; i++) {
            let u = users[i];
            let email = '';
            if (!u.phoneProvider) continue;
            let providerDomain = getProviderDomain(u.phoneProvider);
            if (!providerDomain) continue;
            if (u.phoneProvider === 'tmobile') email += '1';
            email += u.phone;
            email += providerDomain;
            emails.push(email);
        }

        // build list of coupons
        var texts = [];
        for (var i = 0; i < coupons.length; i++) {
            let c = coupons[i];
            if (c.name)
                texts.push(`${c.name}: ${c.url}`);
            else if (c.compayName)
                texts.push(`${c.companyName}: ${c.url}`);
            else
                texts.push(c.url);
        }

        // build text
        var mailConfig = {
            from: `"${config.emailFromName}" <${config.emailFromAddress}>`,
            to: emails.join(', '),
            subject: 'New Coupons',
            text: texts.join('\n'),
        };

        transporter.sendMail(mailConfig, (err, info) => {
            if (err) return next(err);
            return res.json(info);
        });
    })
    .catch((err) => next(err));
};

function getProviderDomain(provider) {
    for (var i = 0; i < config.providers.length; i++) {
        if (provider === config.providers[i].name)
            return config.providers[i].sms;
    }
    return '';
}

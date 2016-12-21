const Coupon = require('../models/schemas/coupon');

exports.getAllCoupons = (req, res, next) => {
    Coupon.find({}, (err, coupons) => {
        if (err) return next(err);
        res.json(coupons);
    });
};

exports.getActiveCoupons = (req, res,next) => {
    var now = new Date();
    Coupon.find({
        $and: [
            { startDate: {$lt: now} },
            { $or: [
                { endDate: {$gt: now} },
                { endDate: {$exists: false} },
            ]}
        ]
    }, (err, coupons) => {
        if (err) return next(err);
        res.json(coupons);
    });
};

exports.getCouponById = (req, res, next) => {
    Coupon.findById(req.params.id, (err, coupon) => {
        if (err) return next(err);
        if (!coupon) return res.status(404).send('No coupon with that ID');
        res.json(coupon);
    });
};

// TODO validation
exports.createCoupon = (req, res, next) => {
    if (!req.body.postedBy) req.body.postedBy = req.user.id;
    if (!req.body.companyName) req.body.companyName = req.user.companyName;
    var newCoupon = new Coupon(req.body);
    newCoupon.save((err, coupon) => {
        if (err) return next(err);
        res.sendStatus(200);
    });
};

// TODO verification
exports.updateCoupon = (req, res, next) => {
    Coupon.findOneAndUpdate({id: req.params.id}, req.body, (err, coupon) => {
        if (err) return next(err);
        return res.sendStatus(200);
    });
};

// TODO auth
exports.deleteCouponById = (req, res, next) => {
    Coupon.findByIdAndRemove(req.params.id, (err, coupon) => {
        if (err) return next(err);
        if (!coupon) return res.status(404).send('No coupon with that ID');
        return res.sendStatus(200);
    });
};

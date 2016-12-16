const Coupon = require('../models/schemas/coupon');

exports.getAllCoupons = (req, res, next) => {
    Coupon.find({}, (err, coupons) => {
        if (err) return next(err);
        res.json(coupons);
    });
};

// TODO
exports.getActiveCoupons = (req, res,next) => {
    var now = new Date();
    res.json([]);
};

exports.getCouponById = (req, res, next) => {
    Coupon.findById(req.params.id, (err, coupon) => {
        if (err) return next(err);
        if (!coupon) return res.status(404).send('No coupon with that ID');
        res.json(coupon);
    });
};

// TODO verification, auth
exports.createCoupon = (req, res, next) => {
    var newCoupon = new Coupon(req.body);
    newCoupon.save((err, coupon) => {
        if (err) return next(err);
        res.sendStatus(200);
    });
};

// TODO
exports.updateCoupon = (req, res, next) => {
    return res.sendStatus(200);
};

// TODO
exports.deleteCouponById = (req, res, next) => {
    return res.sendStatus(200);
};

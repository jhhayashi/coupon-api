const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var couponSchema = new Schema({
    url: {type: String, required: true},
    startDate: {type: Date, default: Date.now, index: true},
    endDate: {type: Date, index: true},
    tags: [Number],
    clicks: {type: [Date], default: []},
    views: {type: [Date], default: []},
    redeemed: {type: [Date], default: []},
    postedBy: {type: Schema.ObjectId, ref: 'User', required: true},
    createdDate: {type: Date, default: Date.now},
    approvedDate: Date,
});

var Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;

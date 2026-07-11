const mongoose = require('mongoose');



const orderSchema = new mongoose.Schema({

    items: [{

        name: String,

        price: Number

    }],

    totalPrice: { type: Number, required: true },

    status: { type: String, default: 'Bekliyor' },

    date: { type: Date, default: Date.now }

});



module.exports = mongoose.model('Order', orderSchema);


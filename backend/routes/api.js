const express = require('express');

const router = express.Router();

const Product = require('../models/Product');

const Order = require('../models/Order');



// --- ÜRÜN API'LERI ---

router.get('/products', async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



router.post('/products', async (req, res) => {

    const { name, price, imageUrl, category } = req.body;

    try {

        const newProduct = new Product({ name, price, imageUrl, category });

        await newProduct.save();

        res.status(201).json(newProduct);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



router.put('/products/:id', async (req, res) => {

    try {

        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });

        res.json(updatedProduct);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



router.delete('/products/:id', async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.json({ message: 'Ürün silindi' });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



// --- SIPARIŞ / ANALITIK API'LERI ---

router.get('/orders', async (req, res) => {

    try {

        const orders = await Order.find();

        res.json(orders);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



router.post('/orders', async (req, res) => {

    const { items, totalPrice } = req.body;

    try {

        const newOrder = new Order({ items, totalPrice });

        await newOrder.save();

        res.status(201).json(newOrder);

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



router.get('/analytics/monthly', async (req, res) => {

    try {

        const orders = await Order.find();

        const totalEarnings = orders.reduce((sum, order) => sum + order.totalPrice, 0);

        res.json({ totalEarnings, totalOrders: orders.length });

    } catch (err) {

        res.status(500).json({ error: err.message });

    }

});



module.exports = router;


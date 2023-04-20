/*
    transaction.js -- Router for the TransactionList
*/
const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
// const { isLoggedIn } = require('./pwauth');

isLoggedIn = (req, res, next) => {
    if (res.locals.loggedIn) {
        next();
    } else {
        res.redirect('/login');
    }
}


// get the value associated to the key
router.get('/transaction/',
    isLoggedIn,
    async (req, res, next) => {
        const sortBy = req.query.sortBy;
        let transactions = [];
        if (sortBy == 'date') {
            transactions= await Transaction.find({})
                .sort({ date: 1 });
        }
        else if (sortBy == 'category') {
            transactions = await Transaction.find({})
                .sort({ category: 1 });
        } else if (sortBy == 'amount') {
            transactions = await Transaction.find({})
                .sort({ amount: 1 });
        } else if (sortBy == 'description') {
            transactions = await Transaction.find({})
                .sort({ description: 1 });
        } else {
            transactions = await Transaction.find({});
        } 

        res.render('transaction', { transactions });
    });

// add the value in the body to the list associated to the key
router.post('/transaction',
    isLoggedIn,
    async (req, res, next) => {
        const transaction = new Transaction(
            {
                description: req.body.description,
                category: req.body.category,
                amount: req.body.amount,
                date: req.body.date,
            });
        await transaction.save();
        res.redirect('/transaction');
    });

router.get('/transaction/remove/:id',
    isLoggedIn,
    async (req, res, next) => {
        console.log("inside /transaction/remove/:id")
        await Transaction.deleteOne({ _id: req.params.id })
        res.redirect('/transaction');
    });

router.get('/transaction/edit/:id',
    isLoggedIn,
    async (req, res, next) => {
        console.log("inside /transaction/edit/:id")
        const transaction = await Transaction.findOne({ _id: req.params.id });
        res.locals.transaction = transaction;
        res.render('transactionEdit');
    });

router.post('/transaction/updateTransactionItem',
    isLoggedIn,
    async (req, res, next) => {
        console.log("inside /transaction/updateTodoItem")
        await Transaction.findOneAndUpdate(
            { _id: req.body.transactionId },
            {$set: {description: req.body.description,
                    category: req.body.category,
                    amount: req.body.amount,
                    date: req.body.date,
                    }});
        res.redirect('/transaction');
    });

router.get('/transaction/byCategory',
    isLoggedIn,
    async (req, res, next) => {
        console.log("inside /transaction/byCategory")
        // const categoryAmounts = await Transaction.find({})
        //     .group({ _id: '$category', total: { $sum: '$amount' } });
        const categoryAmounts = await Transaction.aggregate([
            { $group: { _id: '$category', total: { $sum: '$amount' } } }    
        ]);
        res.locals.categoryAmounts = categoryAmounts;
        res.render('categoryAmount');
    });


module.exports = router;
        

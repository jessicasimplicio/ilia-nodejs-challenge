const express = require ('express')
const { createTransaction } = require('../controllers/transactions')

const router = express.Router()

router.post('/',createTransaction)
router.get('/', getTransactions)

module.exports = router
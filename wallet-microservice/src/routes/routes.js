const express = require ('express')
const { createTransaction, getBalance } = require('../controllers/transactions')

const router = express.Router()

router.post('/transactions', createTransaction)
router.get('/transactions', getTransactions)
router.get('/balance/:user_id', getBalance)
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'Wallet Microservice' })
  })

module.exports = router
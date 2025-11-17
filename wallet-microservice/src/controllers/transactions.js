const Transaction = require('../models/Transaction');

createTransaction = async ( req, res) => {
  try{
      const { userId, amount, type } = req.body
      console.log(userId, amount, type)

      const transaction = {
        userId,
        amount,
        type
      }

      const response = await Transaction.create(transaction)
      res.status(201).json({ response, message: 'Transaction created' })

  } catch(err) {
    console.log(err)
    res.status(500).json({ message: "Erro ao salvar", err})
  } 
} 

module.exports = { createTransaction }
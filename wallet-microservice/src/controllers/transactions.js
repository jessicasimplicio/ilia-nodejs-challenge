const Transaction = require('../models/Transaction');

createTransaction = async (req, res) => {
	try {
		const { user_id, amount, type } = req.body
		console.log(user_id, amount, type)

		const transaction = {
			user_id,
			amount,
			type
		}

		const response = await Transaction.create(transaction)
		res.status(201).json({ response, message: 'Transaction created' })

	} catch (err) {
		console.log(err)
		res.status(500).json({ message: "Error when saving", err })
	}
}

getTransactions = async (req, res) => {
	try {
		const type = req.query.type
		console.log('TYEPEE', type)

		const response = await Transaction.find({type})
	
		res.status(200).json({ response, message: 'Transactions found!' })

	} catch (err) {
		console.log(err)
		res.status(500).json({ message: "Erro when fiding transaction", err })
	}
}


module.exports = { createTransaction, getTransactions }
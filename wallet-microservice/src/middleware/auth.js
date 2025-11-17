const jwt = require ('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const auth = (req, res, next) => {
    const token = req.headers.authorization

    if(!token) {
        return res.status(401).json({ message: 'Not authorized' })  
    }
    next()

    try{
        const decoded = jwt.verify(token.replace('Bearer ', ''), JWT_SECRET)
    } catch(err){
        return res.status(401).json({ message: 'Invalid Token' })
    }

}

module.exports = auth
import dotenv from 'dotenv'
dotenv.config()
// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken');
const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET)

export const authenticationToken = async(req :any, res:any, next:any) =>{
	const headers = req.headers['authorization']
	const token = headers && headers.split(' ')[1]
	
	if (token === null) return next(res.status(401))
	jwt.verify(token, ACCESS_TOKEN_SECRET, (err:any, user:any) => {
	   if (err) {
		  return next(res.status(403))
	   }
 
	   req.user = user
	})
 
	next()
}
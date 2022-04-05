import dotenv from 'dotenv'
dotenv.config()
import express, { response } from 'express'
import { Router } from 'express-serve-static-core'
import { connection } from './../../configs/database.config'
import { Message, Codes } from '../../utils/main.enums'
import bcrypt from 'bcrypt'

import { authenticationToken } from '../../middleware/auth'
const jwt = require('jsonwebtoken');
import axios from 'axios'


const saltRounds : any = process.env.SALT_ROUNDS
const password : any = process.env.STAT_PASSWORD
const salt = bcrypt.genSaltSync(parseInt(saltRounds));
const savePassword = bcrypt.hashSync(password, salt)
const ACCESS_TOKEN_SECRET = String(process.env.ACCESS_TOKEN_SECRET)

const customQuery = (Query :any , values :any) =>{
	
	return new Promise((resolve, reject)=>{
		
		connection.query(Query, values, (err, result)=>{
			if(err) {
				reject(err)
			}else{
				resolve(result)
			}
		})
	})
}

const resetPassword = async(BRANCHCODE:any) => {
	try{
		connection.beginTransaction()
		return await new Promise((resolve, reject)=>{
			connection.query("UPDATE user_account SET password=? WHERE username=?", [savePassword, BRANCHCODE], (err, result)=>{
				if(err) return reject(err)
				resolve(result)
			})
		}).then((response:any)=>{
			
			connection.commit()
			if(response.affectedRows !== 1){
				return 'again'
			}else{
				return 'ok'
			}
		})
	}catch(err:any){
		connection.rollback()
		return err
	}
}
const generateToken = async(user:any) =>{
	return jwt.sign( { user }, ACCESS_TOKEN_SECRET, { expiresIn : '8h' })
}
const getIpAddress = async() =>{
	try{
		const response :any = await axios.get(`http://ip-api.com/json`)
		return JSON.stringify(response.data)
	}catch(err:any){
		return err
	}
}
class UserController {
    private router: Router
    constructor() {
        this.router = express.Router()
    }
    watchRequests() {
        /**
         * @Functions
         */
        this.router.post('/checkuserAccount', async(req, res)=>{

            const { username, password } = req.body;
			var response2 :any
			 try{
                connection.beginTransaction()
				return new Promise((resolve)=>{
					connection.query("SELECT * FROM user_account WHERE username=? AND status=?", [username, 0], (err, result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any)=>{
					if(!response.length){
						res.status(Codes.UNAUTHORIZED).send({ message : 'Username is incorrect' })
					}else{
						
						if(	bcrypt.compareSync(password, response[0].password)){
							/**check first if online or offline except admin */
							/**
							 * 0 login
							 * 1 cant login user is already online
							 */
							const token = await generateToken(username)
							if(response[0].user_type === 'Admin'){
								res.status(Codes.SUCCESS).send([response[0], token])
							}else{
								let Query = "SELECT * FROM user_account WHERE username=? AND isonline=?"
								let values = [username,0]
								const response1 :any = await customQuery(Query, values)
								/**update isonline  */
								let Query1 = "UPDATE user_account SET isonline=? WHERE username=?"
								let values1 = [1, username]

								!response1.length 
								? res.status(Codes.UNAUTHORIZED).send({ message : 'Your account was Login to other PC' }) 
								: response2 =  await customQuery(Query1, values1) 
								
								response2.affectedRows > 0 ? res.status(Codes.SUCCESS).send([response[0], token]) : ''
							}
							
						}else{
							res.status(Codes.UNAUTHORIZED).send({ message : 'Your Password is incorrect' })
						}
					}

				}).catch(err=>{
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
            }catch(err:any){
				
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }
        
        })

        this.router.post('/getUser',authenticationToken, async (req, res) => {
            const { type, type_code } = req.body
			
            try{
                switch(type){
                    case 'Branch Head':
                        connection.query("SELECT * FROM branch_list WHERE branchCode=?", [type_code], (err, result)=>{
                            if(err) throw err;
                            res.status(Codes.SUCCESS).send(result)
                        })
                    break;

                    case 'Franchise':
						connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [type_code], (err, result)=>{
							if(err) throw err;
                            res.status(Codes.SUCCESS).send(result)
						})
                    break;

                    case 'iBarangay':
						connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [type_code], (err, result) =>{
							if(err) throw err;
                            res.status(Codes.SUCCESS).send(result)
						})
                    break;

                    case 'Teller':
						connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [type_code], (err, result)=>{
							if(err) throw err;
                           
                            res.status(Codes.SUCCESS).send(result)
						})
                    break;
                    default:
                }
            }catch(err:any){
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }
        })

        this.router.post('/getUserForBfranchise',authenticationToken, async(req, res)=>{
            const { branchCode  } = req.body
            
            try{
                connection.query('SELECT * FROM franchise_list WHERE branchCode=?', [branchCode], (err, result)=>{
                    if(err) throw err;
                    
					res.status(Codes.SUCCESS).send(result)
                })
            }catch(err:any){
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }
        })//branch head display for his only franchise
        this.router.post('/getForBranchIB',authenticationToken, async(req, res) =>{
            const { branchCode } = req.body
            try{
                connection.query('SELECT * FROM ibrgy_list WHERE branchCode=?', [branchCode], (err, result)=>{
                    if(err) throw err;
                    res.status(Codes.SUCCESS).send(result)
                })
            }catch(err:any){
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }
        })// branch head display for ibarangay
        this.router.post('/getForBranchTeller', authenticationToken,async (req, res) => {
            const { branchCode } = req.body
            try{
                connection.query("SELECT * FROM teller_list WHERE branchCode=?", [branchCode], (err, result) =>{
                    if(err) throw err;
                    res.status(Codes.SUCCESS).send(result)
                })
            }catch(err:any){
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }          
        })
		//start for franchise user queries
        this.router.post('/getForFranchiseList',authenticationToken,async (req, res) => {
            const { fbranchCode } = req.body
           try{
				connection.query("SELECT * FROM ibrgy_list WHERE ib_fbranchCode=?", [fbranchCode],(err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
		   }catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
		   }
        })
		this.router.post('/getTellerlistFr',authenticationToken,async (req, res) => {
			const { fbranchCode } = req.body
			try{
				connection.query("SELECT * FROM teller_list WHERE fiB_code=?", [fbranchCode], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

        this.router.post('/getTellerIbarangay',authenticationToken,async (req, res) => {
            const { ib_code } = req.body
            try{
                connection.query("SELECT * FROM teller_list WHERE ibrgy_code=?", [ib_code],(err, result)=>{
                    if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
                    
                })
            }catch(err:any){
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }
        })

        this.router.post('/changePassword',authenticationToken,async (req, res) => {

            const { code, data} = req.body
			const newPassword = bcrypt.hashSync(data.newPassword, salt)

			try{

				connection.beginTransaction()
				return new Promise((resolve)=>{
					connection.query("SELECT * FROM user_account WHERE username=?", [code],(err, result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any)=>{
					if(!response.length){
						res.status(Codes.SUCCESS).send({ message: 'undefined' })
					}else{
						/**
						 * compare password current to database password
						 */
						(bcrypt.compareSync(data.currentPassword, response[0].password))
						? await Promise.resolve(
							connection.query("UPDATE user_account SET password=? WHERE username=?", [newPassword, code], (err,result)=>{
								if(err) throw err;
								res.status(Codes.SUCCESS).send({ message : 'ok'})
							})
						 )
						: res.status(Codes.SUCCESS).send({ message : 'notMatch' })
					}
				})

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}

        })

        this.router.get('/getUsernameBranchCode',authenticationToken,async (req, res) => {

			try{
				connection.query("SELECT username FROM user_account WHERE whitelist=?",[''],(err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
					
				})	
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}             
        })

		this.router.post('/putWhitelist',async (req, res) => {
			
			const { data, updated_by } = req.body
			
			try{
				const date =  new Date()
				
				connection.query("UPDATE user_account SET whitelist=?, update_by=?, updated_date=? WHERE username=?",
				[data.whitelist, updated_by, date, data.branchCode], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send('success')
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})
		this.router.get('/getBranchCodeWithWhitelist',async (req, res) => {
			try{
				connection.query("SELECT * FROM user_account WHERE user_type!=? AND whitelist!=?",['Admin',''],(err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
					
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}	
		})


		this.router.post('/getBranchNameOfTeller',authenticationToken,async (req, res) => {
			
			const { branchCode } = req.body
			
			try{
				connection.beginTransaction()
				return await new Promise((resolve, reject) =>{
					connection.query("SELECT * FROM teller_list WHERE tellerCode=?", [branchCode], (err, result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any) =>{
					
					if(response[0].fiB_Code !== '' && response[0].ibrgy_code !== ''){
						await Promise.resolve(
							connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [response[0].ibrgy_code], (err, result)=>{
								if(err) throw err;
								connection.commit()
								res.status(200).send(JSON.stringify(result))
							})
						)
					}else if(response[0].fiB_Code !== '' && response[0].ibrgy_code === ''){
						await Promise.resolve(
							connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [response[0].fiB_Code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}else if (response[0].fiB_Code === '' && response[0].ibrgy_code !== ''){
						await Promise.resolve(
							connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyCode=?", [response[0].ibrgy_code], (err,result)=>{
								if(err)throw err;
								connection.commit()
								res.status(Codes.SUCCESS).send(JSON.stringify(result))
							})
						)
					}	
				}).catch(err=>{
					connection.rollback()
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}		
		})
		
		this.router.post('/getNameOfBranchesForModalAdmin',authenticationToken,async (req, res) => {
			const { fbranchCode } = req.body
			try{
				const code = fbranchCode.slice(0,3)

				if(code === 'BRA' ){

					await Promise.resolve(
						connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [fbranchCode], (err, result)=>{
							if(err) throw err;
							res.status(Codes.SUCCESS).send(JSON.stringify(result))
						})
					)
					
				}else if(code === 'FRA' ){
					await Promise.resolve(
						connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [fbranchCode], (err, result)=>{
							if(err) throw err;
							res.status(Codes.SUCCESS).send(JSON.stringify(result))
						})
					)
				}
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateAccountInformationBranches',authenticationToken,async (req, res) => {
			
			const { type, code, data } = req.body
			
			try{
				(type === 'Franchise')
				? await Promise.resolve(
					connection.query("UPDATE franchise_list SET lastname=?, firstname=?, contactNo=?, email=?, location=?,  update_byss=? WHERE fbranchCode=?", 
					[data.ownerLastname, data.ownerFirstname, data.contactNo, data.emailAdd, data.address, 'you', code], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
				
				: await Promise.resolve(
					connection.query("UPDATE ibrgy_list SET lastname=?, firstname=?, contactNo=?, email=?, location=?, updated_byy=? WHERE ib_ibrgyyCode=?", 
					[data.ownerLastname, data.ownerFirstname, data.contactNo, data.emailAdd, data.address, 'you', code], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(JSON.stringify(result))
					})
				)
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/loginLogs',authenticationToken,async (req, res) => {
			
			const { user_type, username} = req.body
			const ip :any = await getIpAddress()

			const data = ['isOnline', username, user_type, JSON.stringify(req.body), Codes.SUCCESS, ip]
			
			try{
				connection.beginTransaction()

			    return await new Promise((resolve, reject)=>{

					connection.query("INSERT INTO activitylogs (affectedColumn, reference, loggedBy, dataBefore, logStatusCode, ip) VALUES (?, ?, ?, ?, ?, ?) ", data, (err, result) => {
						if(err) return reject(err)
						resolve(result)
					})
				}).then((response:any)=>{
					res.status(Codes.SUCCESS).send({ message : 'ok' })
					connection.commit()
				}).catch((err:any)=>{
					throw err
				})
				
				
			}catch(err:any){
				console.log(err);
				
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				
				connection.rollback()
			}
						
		})

		this.router.post('/signOut',authenticationToken,async (req, res) => {
			
			const { type, code } = req.body
			try{
				connection.beginTransaction()
				
				let Query = "INSERT INTO activitylogs (affectedColumn, reference, loggedBy, dataBefore, logstatusCode) VALUES (?, ?, ?, ?, ?) "
				let data = ['offLine', code, type, '', Codes.SUCCESS]
				const response :any = await customQuery(Query, data)
				/**update user_account isonline */
				let Query1 = "UPDATE user_account SET isonline=? WHERE username=?"
				let values1 = [0, code]
				response.affectedRows > 0 ? await customQuery(Query1, values1) : ''

				connection.commit()
				res.status(Codes.SUCCESS).send({ message : 'ok' })
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/tellerChangePassword',authenticationToken,async (req, res) => {
			
			const { data, user } = req.body

			const newPassword = bcrypt.hashSync(data.newPassword, salt)

			try{
				connection.beginTransaction()
				return await new Promise((resolve)=>{
					connection.query('SELECT * FROM user_account WHERE username=?', [user],(err,result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any)=>{

					if(!response.length){

						res.status(Codes.SUCCESS).send( { message : 'somethingWrong' } )
					}else{
						(bcrypt.compareSync(data.currentPassword, response[0].password))
						?   await Promise.resolve(
								connection.query("UPDATE user_account SET password=? , updated_date=? WHERE username=?", [newPassword, new Date(), user], (err, result)=>{
									if(err) throw err;
									res.status(Codes.SUCCESS).send( { message : 'ok' } )
								})
							)  
						
						: res.status(Codes.SUCCESS).send( { message : 'notMatch' } )
						
					}

					connection.commit()

				}).catch(err=>{
					connection.rollback()
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
			
		})

		this.router.post('/resetPassword',authenticationToken,async (req, res) => {
			
			const { branchCode, ib_fbranchCode, fbranchCode, ib_ibrgyyCode, tellerCode } = req.body
			
			if(branchCode !== null && fbranchCode === null && tellerCode === null && ib_fbranchCode === null || branchCode !== undefined && fbranchCode === undefined && tellerCode === undefined && ib_fbranchCode === undefined){
				/** reset branchCode */
				const response :any = await resetPassword(branchCode)
				res.status(Codes.SUCCESS).send({ message : response })
				
			}else if(branchCode !== null && fbranchCode !== null && tellerCode === null || branchCode !== undefined && fbranchCode !== undefined && tellerCode === undefined ){
				/**reset franchise */
				const response :any = await resetPassword(branchCode)
				res.status(Codes.SUCCESS).send({ message : response })
				
			}else if(branchCode !== null && ib_fbranchCode !== null && ib_ibrgyyCode !== null && tellerCode === null || branchCode !== undefined && ib_fbranchCode !== undefined && ib_ibrgyyCode !== undefined && tellerCode === undefined) {
				/** reset ibarangay */
				const response :any = await resetPassword(branchCode)
				res.status(Codes.SUCCESS).send({ message : response })
				
			}else if(tellerCode !== null || tellerCode !== undefined){
				/**reset teller */
				const response :any = await resetPassword(branchCode)
				res.status(Codes.SUCCESS).send({ message : response })
			}
			
		})
	}/**
	*@ENDoFWatchRequest
	 */
    get routerObject() { return this.router }
}


const user = new UserController()

user.watchRequests()
export default user.routerObject



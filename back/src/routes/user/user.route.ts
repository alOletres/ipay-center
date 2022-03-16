import express, { response } from 'express'
import { Router } from 'express-serve-static-core'

import { connection } from './../../configs/database.config'

import { Message, Codes } from '../../utils/main.enums'
import address from 'address'
import bcrypt from 'bcrypt'
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
			
            try{
                connection.beginTransaction()
				return new Promise((resolve)=>{
					connection.query("SELECT * FROM user_account WHERE username=? AND status=?", [username, 0], (err, result)=>{
						if(err) throw err;
						resolve(result)
					})
				}).then(async(response:any)=>{

					
					if(!response.length){
						
						res.status(400).send('Something Went Wrong')
					
					}else{
						
						if(	bcrypt.compareSync(password, response[0].password)){
						
							res.status(Codes.SUCCESS).send(response[0])
						
						}else{
							
							res.status(400).send('Something Went Wrong')
						}
					}

				}).catch(err=>{
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
            }catch(err:any){
				
                res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            }
        
        })

        this.router.post('/getUser', async (req, res) => {
            const { type, type_code } = req.body
			
            try{
                switch(type){
                    case 'Branch Head':
                        // query here
                        connection.query("SELECT * FROM branch_list WHERE branchCode=?", [type_code], (err, result)=>{
                            if(err) throw err;
                            res.status(Codes.SUCCESS).send(result)
                        })
                    break;

                    case 'Franchise':
                        // query here
						connection.query("SELECT * FROM franchise_list WHERE fbranchCode=?", [type_code], (err, result)=>{
							if(err) throw err;
                            res.status(Codes.SUCCESS).send(result)
						})
                    break;

                    case 'iBarangay':
                        // query here
						connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [type_code], (err, result) =>{
							if(err) throw err;
                            res.status(Codes.SUCCESS).send(result)
						})
                    break;

                    case 'Teller':
                        // query here 
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

        this.router.post('/getUserForBfranchise', async(req, res)=>{
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
        this.router.post('/getForBranchIB', async(req, res) =>{
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
        this.router.post('/getForBranchTeller',async (req, res) => {
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
        this.router.post('/getForFranchiseList',async (req, res) => {
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
		this.router.post('/getTellerlistFr',async (req, res) => {
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

        this.router.post('/getTellerIbarangay',async (req, res) => {
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

        this.router.post('/changePassword',async (req, res) => {

            const { code, data} = req.body
			

			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);
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

        this.router.get('/getUsernameBranchCode',async (req, res) => {

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


		this.router.post('/getBranchNameOfTeller',async (req, res) => {
			
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
		
		this.router.post('/getNameOfBranchesForModalAdmin',async (req, res) => {
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

		this.router.post('/updateAccountInformationBranches',async (req, res) => {
			
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

		this.router.post('/changePasswordForBranches',async (req, res) => {
			
			const { type, code, data } = req.body
			
			/***
			 *@FranchiseCode FRA
			 *@iBarangayCode BRA
			 *@TellerCode FRT BRT 
			 */
			
			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);
			const newPassword = bcrypt.hashSync(data.newPassword, salt)

			// if(user_code === 'FRT' || user_code === 'BRT'){
			// 	try{
			// 		connection.beginTransaction()
			// 		return await new Promise((resolve, reject)=>{
			// 			connection.query("SELECT * FROM teller_list WHERE branchCode=? AND tellerCode=?", [code, data.username], (err, result)=>{
			// 				if(err) throw err;
			// 				resolve(result)
			// 			})
			// 		}).then(async(result:any) => {

			// 			if(!result.length){

			// 				res.status(200).send({message : 'NotMatch'})
						
			// 			}else{

			// 				await new Promise((resolve, reject)=>{
			// 					connection.query("SELECT * FROM user_account WHERE username=?", [data.username], (err, result)=>{
			// 						if(err) throw err;
			// 						resolve(result)
			// 					})
			// 				}).then(async(response:any)=>{

			// 					if(!response.length){

			// 						res.status(200).send({message : 'userNameNotMatch'})
								
			// 					}else{

			// 						(bcrypt.compareSync(data.currentPassword, response[0].password))

			// 						? await Promise.resolve(
			// 							connection.query("UPDATE user_account SET password=?, update_by=?, updated_date=? WHERE username=?", 
			// 							[newPassword, code, dateNow, data.username], (err, result)=>{
			// 								if(err) throw err;
			// 								res.status(200).send ({ message : 'ok' })
			// 							})
			// 						)

			// 						: res.status(200).send({message : 'wrongPassword'})
			// 					}

			// 				})

			// 			}
					
			// 		}).catch((err : any) => {
			// 			res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 		});
			// 	}catch(err:any){
			// 		res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 	}
			// }else if(user_code === 'FRA'){

			// 	try{
			// 		connection.beginTransaction()
			// 		return await new Promise((resolve, reject)=>{
			// 			connection.query("SELECT * FROM franchise_list WHERE branchCode=? AND fbranchCode=?", [code, data.username], (err, result)=>{
			// 				if(err) throw err;
			// 				resolve(result)
			// 			})
			// 		}).then(async(response : any)=>{

			// 			if(!response.length){
			// 				res.status(200).send({message : 'NotMatch'})
			// 			}else{
			// 				/**
			// 				 * @checkThePassword
			// 				 */
			// 				await new Promise((resolve, reject)=>{
			// 					connection.query("SELECT * FROM user_account WHERE username=?", [data.username], (err, result)=>{
			// 						if(err) throw err;
			// 						resolve(result)
			// 					})
			// 				}).then(async(result:any)=>{

			// 					if(!result.length){
			// 						res.status(200).send({message : 'userNameNotMatch'})
			// 					}else{
			// 						(bcrypt.compareSync(data.currentPassword, result[0].password))
			// 						? await Promise.resolve(
			// 							connection.query("UPDATE user_account SET password=?, update_by=?, updated_date=? WHERE username=?", 
			// 							[newPassword, code, dateNow, data.username], (err, result)=>{
			// 								if(err) throw err;
			// 								res.status(200).send ({ message : 'ok' })
			// 							})
			// 						)

			// 						: res.status(200).send({message : 'wrongPassword'})
			// 					}
			// 				}) 
			// 			}
						
			// 		}) 
			// 	}catch(err:any){
			// 		res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 	}

			// }else if(user_code === 'BRA'){
			// 	try{
			// 		connection.beginTransaction()
			// 		return await new Promise((resolve, reject) =>{
			// 			connection.query("SELECT * FROM ibrgy_list WHERE branchCode=? AND ib_ibrgyyCode=?", [code, data.username], (err, result)=>{
			// 				if(err) throw err;
			// 				resolve(result)
			// 			})
			// 		}).then(async(response:any)=>{
						
			// 			if(!response.length){
			// 				res.status(200).send({message : 'NotMatch'})
			// 			}else{
			// 				/**
			// 				 * @If MATCH DIN CHECK PASSWORD
			// 				 */
			// 				await new Promise((resolve, reject)=>{
			// 					connection.query("SELECT * FROM user_account WHERE username=?", [data.username], (err, result)=>{
			// 						if(err) throw err;
			// 						resolve(result)

			// 					})
			// 				}).then(async(result:any)=>{

			// 					if(!result.length){

			// 						res.status(200).send({message : 'userNameNotMatch'})
								
			// 					}else{

			// 						(bcrypt.compareSync(data.currentPassword, result[0].password))
			// 						? await Promise.resolve(
			// 							connection.query("UPDATE user_account SET password=?, update_by=?, updated_date=? WHERE username=?", 
			// 							[newPassword, code, dateNow, data.username], (err ,result)=>{
			// 								if(err) throw err;
			// 								res.status(200).send ({ message : 'ok' })
			// 							})
			// 						)
			// 						: res.status(200).send({ message : 'ok' })
			// 					}
			// 				})
			// 			}
			// 		})
			// 	}catch(err:any){
			// 		res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// 	}
			// }
			
		})

		this.router.post('/loginLogs',async (req, res) => {
			
			const { user_type, username} = req.body
			
			const data = ['isOnline', username, user_type, JSON.stringify(req.body), Codes.SUCCESS]
			
			try{
				connection.beginTransaction()

			    await new Promise((resolve, reject)=>{

					connection.query("INSERT INTO activitylogs (affectedColumn, reference, loggedBy, dataBefore, logStatusCode) VALUES (?, ?, ?, ?, ?) ", data, (err, result) => {
						if(err) return reject(err)
						resolve(result)
					})
				}).then(()=>{
					
					res.status(Codes.SUCCESS).send({ message : 'ok' })
					connection.commit()
				}).catch((err:any)=>{
					throw err
				})
				
				
			}catch(err:any){
				
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				
				connection.rollback()
			}
						
		})

		this.router.post('/signOut',async (req, res) => {
			
			const { type, code } = req.body
			const data = ['offLine', code, type, '', Codes.SUCCESS]
			try{
				connection.beginTransaction()
				connection.query("INSERT INTO activitylogs (affectedColumn, reference, loggedBy, dataBefore, logstatusCode) VALUES (?, ?, ?, ?, ?) ", 
					data, (err, result)=>{
					if(err) throw err;
					return true
				})
				connection.commit()
				res.status(Codes.SUCCESS).send({ message : 'ok' })
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/tellerChangePassword',async (req, res) => {
			
			const { data, user } = req.body

			const saltRounds = 10;
			const salt = bcrypt.genSaltSync(saltRounds);
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

		
	}/**
	*@ENDoFWatchRequest
	 */
    get routerObject() { return this.router }
}


const user = new UserController()

user.watchRequests()
export default user.routerObject



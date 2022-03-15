import express, { response } from 'express'
import { Router } from 'express-serve-static-core'

import { connection } from './../../configs/database.config'
import { Message, Codes } from '../../utils/main.enums'

import bcrypt from 'bcrypt'

interface data {
	res : Array<object>
}
class BranchController {

    private router: Router

    constructor() {
        this.router = express.Router()
    }

    watchRequests() {

        /**
         * @Functions
         */

		this.router.post('/saveBranch', async (req, res) => {
			
			const { data, reference } = req.body
		
			try {
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query("SELECT * from branch_count WHERE type=?", 
					['Branch Head'], (err, result) => {
						if(err) throw err
						
						resolve (result)
					})
				})
				.then(async (responce: any) => {
					
					const i = parseInt(responce[0].count)+1
					const type = 'BH'
					const saltRounds : any = process.env.SALT_ROUNDS
					const password : any = process.env.STAT_PASSWORD
					const salt = bcrypt.genSaltSync(parseInt(saltRounds));
					const savePassword = bcrypt.hashSync(password, salt)
					
					
					await Promise.all([
						 Promise.resolve(
							connection.query("INSERT INTO branch_list(ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, branchType, branchCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
							[data.ownerFirstname, data.ownerLastname, data.contactNo, data.emailAdd, data.address, data.branchName, 'Branch Head', type+('000'+i).slice(-4)], (err, result) => {
								if(err) throw err;
								
								return result
							})
						),  Promise.resolve(
							connection.query("INSERT INTO user_account(user_type, username, password, status) VALUES (?, ?, ?, ?)",
							[ 'Branch Head', type+('000'+i).slice(-4), savePassword, 1], (err, result)=>{
								if(err) throw err;
							
								return result
							})
						),  Promise.resolve(
							connection.query("UPDATE branch_count SET count=? WHERE type=?",
							[i, 'Branch Head'], (err, result) => {
								if(err) throw err
								return result
							})
						) 
						
					])
					connection.commit()
					res.status(Codes.SUCCESS).send({ message : 'ok' })
					
					
				})
				.catch((err) => {
					
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}

		})


		this.router.get('/getBranches', async (req, res) => {
			try {
				connection.query("SELECT * FROM branch_list", (err, result) => {
					if(err) throw err;

					res.status(Codes.SUCCESS).send(result)
				})
			} catch (err: any) {
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		this.router.post('/updateBranch', async (req, res) => {
			const { ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, id } = req.body
			
			try {
				connection.query("UPDATE branch_list SET ownerFirstname=?, ownerLastname=?, contactNo=?, emailAdd=?, address=?, branchName=? WHERE b_id=?",
				[ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, id], (err, result) => {
					if(err) throw err;

					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
				})
			} catch (err: any) {
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}	
		})
		this.router.post('/updateBranchStatus', async (req, res) => {
			const {data, loggedBy} = req.body


			
			try{
				if(data.branchStatus == 1){

					connection.beginTransaction()
					return new Promise((resolve, reject)=>{
						connection.query("UPDATE branch_list SET branchStatus=? WHERE b_id=?",
						[0, data.b_id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then(async(response:any)=>{

						await Promise.resolve(
							connection.query("UPDATE user_account SET status =? WHERE username =?", [0, data.branchCode], (err, result)=>{
								if(err) throw err;
								res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
							})
						)

						// await Promise.resolve(
						// 	connection.query("INSERT INTO activitylogs (affectedTable, loggedBy, dataBefore, logStatusCode) VALUES (?, ?, ?, ?)", 
						// 	['branch_list', loggedBy, JSON.stringify(req.body), Codes.SUCCESS], (err, result)=>{
						// 		if(err) throw err
						// 		res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						// 	})
						// )

						connection.commit()
					})
					
				}else{

					connection.beginTransaction()
					return new Promise((resolve)=>{
						connection.query("UPDATE branch_list SET branchStatus=? WHERE b_id=?",
						[1, data.b_id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then(async(response:any)=>{
						await Promise.resolve(
							connection.query("UPDATE user_account SET status =? WHERE username =?", [1, data.branchCode], (err, result)=>{
								if(err) throw err;
								res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
							})
						)
						
						// await Promise.resolve(
						// 	connection.query("INSERT INTO activitylogs (affectedTable, loggedBy, dataBefore, logStatusCode) VALUES (?, ?, ?, ?)", 
						// 	['branch_list', loggedBy, JSON.stringify(data), Codes.SUCCESS], (err, result)=>{
						// 		if(err) throw err
						// 		res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						// 	})
						// )
						connection.commit()
					})
					
				}
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		// end of Branch Head Query

		// start of Franchise query
		this.router.post('/saveFbranch', async(req, res) => {
			const type = "FRA"
			const { firstname, lastname, contactNo, email, locationAddress, branchName, code } = req.body

			try {
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query("SELECT * from branch_count WHERE type=?", 
					['Franchise'], (err, result) => {
						if(err) throw err
						
						resolve (result)
					})
				})
				.then(async (responce: any) => {

					const i = parseInt(responce[0].count)+1

					const saltRounds : any = process.env.SALT_ROUNDS
					const password : any = process.env.STAT_PASSWORD
					const salt = bcrypt.genSaltSync(parseInt(saltRounds));
					const savePassword = bcrypt.hashSync(password, salt)
					
					await Promise.all([
						Promise.resolve(
							connection.query("INSERT INTO franchise_list (branchCode, fbranchCode, franchiseName, fbranchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
							[code, type+('000'+i).slice(-4), branchName, 'Franchise', lastname, firstname, contactNo, email, locationAddress, 1 ], (err, result) => {
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("INSERT INTO user_account(user_type, username, password, status) VALUES (?, ?, ?, ?)", 
							['Franchise', type+('000'+i).slice(-4), savePassword, 1], (err, result)=>{
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("UPDATE branch_count SET count=? WHERE type=?",
							[i, 'Franchise'], (err, result) => {
								if(err) throw err
								
								return result
							})
						)
					])
					connection.commit()
					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
					
				})
				.catch((err) => {
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		/**
		 * @franchiseList
		 */
		this.router.get('/getFranchiselist', async(req, res) =>{
			try{
				 connection.query('SELECT * FROM franchise_list', (err, result) =>{
					if(err) throw err;

					res.status(Codes.SUCCESS).send(result)
				 })

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		// wallet for new franchisee 
		this.router.post('/savefWallet', async(req, res) =>{
			const { wallet, branchCode } = req.body
			try{
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query('SELECT branchCode, fbranchCode FROM franchise_list WHERE branchCode =? ORDER  BY id DESC LIMIT 1 ', [branchCode], (err, result)=>{
						if(err) throw err;
						
						resolve (result)
					})
				}).then((responce: any) => {
					const fbranchCode = (responce[0].fbranchCode);
					connection.query('INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)', [fbranchCode, wallet, wallet], (err, result) =>{
						if(err) throw err;
						connection.commit()
						res.status(Codes.SUCCESS).send(result)
					})
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		}) //end of new franchise wallet

		// wallet for new ibarangay
		this.router.post('/saveibWallet', async(req, res)=>{
			const {fbranchCode, wallet } = req.body
			try{
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query('SELECT ib_fbranchCode, ib_ibrgyyCode FROM ibrgy_list WHERE ib_fbranchCode=? ORDER BY ib_id DESC LIMIT 1',[fbranchCode], (err, result)=>{
						if(err) throw err;
						resolve (result)
					})
				}).then((responce: any) => {
					const ib_branchCode = (responce[0].ib_ibrgyyCode);
					
					connection.query('INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)', [ib_branchCode, wallet, wallet], (err, result) =>{
						if(err) throw err;
						connection.commit()
						res.status(Codes.SUCCESS).send(result)
					})
				})
				
				
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		// end for new ibarangay walleting

		// start new query!
		this.router.post('/updateFbranchStatus', async (req, res) => {
			const {data, approved_by} = req.body
			
			try{
				if(data.status === 1){
					connection.beginTransaction()
					return new Promise((resolve, reject)=>{

						connection.query("UPDATE franchise_list SET status=? WHERE id=?",
						[0, data.id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then((response:any) =>{

						connection.query("UPDATE user_account SET status=? WHERE username=?", [0, data.fbranchCode], (err, result)=>{
							if(err) throw err;
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					})
					
				}else{

					connection.beginTransaction()
					return new Promise((resolve, reject)=>{
						connection.query("UPDATE franchise_list SET status=? WHERE id=?",
						[1, data.id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then((response:any)=>{
						connection.query("UPDATE user_account SET status=?, approved_by=? WHERE username=?", [1, approved_by, data.fbranchCode], (err, result)=>{
							if(err) throw err;
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					})
					
				}
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateFbranch', async (req, res)=>{
			const { data } = req.body
			try{
				connection.query('UPDATE franchise_list SET franchiseName=?, lastname =?, firstname =?, contactNo =?, email =?, location =? WHERE id =?', 
				[data.branchName, data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, data.id ],(err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
						
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
			
		})
		// the end of franchise query

		// start for ibarangay query
		this.router.post('/saveIbarangay', (req, res) =>{
			const type = "BRA"
			const { branchCode, fbranchCode, branchName, lastname, firstname, suffix,  contactNo, email, locationAddress }  = req.body
			try {
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query("SELECT * from branch_count WHERE type=?", 
					['iBarangay'], (err, result) => {
						if(err) throw err
						
						resolve (result)
					})
				})
				.then(async (responce: any) => {
					const i = parseInt(responce[0].count)+1

					const saltRounds : any = process.env.SALT_ROUNDS
					const password : any = process.env.STAT_PASSWORD
					const salt = bcrypt.genSaltSync(parseInt(saltRounds));
					const savePassword = bcrypt.hashSync(password, salt)
				
					await Promise.all([
						Promise.resolve(
							connection.query("INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
							[branchCode, fbranchCode, type+('000'+i).slice(-4), branchName, 'iBarangay', lastname, firstname, contactNo, email, locationAddress, 1 ], (err, result) => {
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?)", 
							['iBarangay', type+('000'+i).slice(-4), savePassword, 1], (err, result)=>{
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("UPDATE branch_count SET count=? WHERE type=?",
							[i, 'iBarangay'], (err, result) => {
								if(err) throw err
								
								return result
							})
						)
					])
					connection.commit()
					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
					
				})
				.catch((err) => {
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/getIbarangaylist', async(req, res) =>{
			try{
				 connection.query('SELECT * FROM ibrgy_list', (err, result) =>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				 })

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			
				
			}
		})

		this.router.post('/updateStatusIb', async (req, res)=>{
			const { data, approved_by} = req.body
			
			try{
				if(data.status == 1){
					connection.beginTransaction()
					return new Promise((resolve)=>{
						connection.query("UPDATE ibrgy_list SET status=? WHERE ib_id=?",
						[0, data.ib_id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then(async()=>{

						connection.query("UPDATE user_account SET status=? WHERE username=?", [0, data.ib_ibrgyyCode],(err, result)=>{
							if(err)throw err;
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					})
				}else{
					connection.beginTransaction()
					
					return new Promise((resolve)=>{
						connection.query("UPDATE ibrgy_list SET status=? WHERE ib_id=?",
						[1, data.ib_id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then(async()=>{

						connection.query("UPDATE user_account SET status=?, approved_by=? WHERE username=?", [1, approved_by, data.ib_ibrgyyCode],(err, result)=>{
							if(err) throw err;
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					})
					
				}
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
			
		})

		this.router.post('/updateIbarangaylist', async (req, res)=>{
			const { data } = req.body
			try{
				connection.query('UPDATE ibrgy_list SET franchiseName=?, lastname =?, firstname =?, contactNo =?, email =?, location =? WHERE ib_id =?', 
				[data.branchName, data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, data.ib_id ],(err, result)=>{
					if(err) throw err;
					
					(result.affectedRows === 1) 
						? res.status(200).send({ message: 'ok' }) 
						:	(result.affectedRows === 0) ? res.status(200).send({ message: 'undefined' }) 
						: ''
				})
			}catch(err:any){
				
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
			
		})

		this.router.post('/addibTeller', (req, res) =>{
			const { data, fbranchCode, branchCode }  = req.body
			const type = "BRT"
		
			try {
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query("SELECT * from branch_count WHERE type=?", 
					['BRTeller'], (err, result) => {
						if(err) return reject(err)
						
						resolve (result)
					})
				})
				.then(async (responce: any) => {

					const i = parseInt(responce[0].count)+1
					const saltRounds : any = process.env.SALT_ROUNDS
					const password : any = process.env.STAT_PASSWORD
					const salt = bcrypt.genSaltSync(parseInt(saltRounds));
					const savePassword = bcrypt.hashSync(password, salt)

					await Promise.all([
						Promise.resolve(
							connection.query("INSERT INTO teller_list (branchCode, fiB_Code, tellerCode, type, firstname, lastname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
							[branchCode, fbranchCode, type+('000'+i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 0 ], (err, result) => {
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("INSERT INTO user_account (user_type, username, password) VALUES (?, ?, ?) ", 
							['Teller', type+('000'+i).slice(-4), savePassword], (err, result)=>{
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("UPDATE branch_count SET count=? WHERE type=?",
							[i, 'BRTeller'], (err, result) => {
								if(err) throw err
								
								return result
							})
						)
					])
					connection.commit()
					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
					
				})
				.catch((err) => {
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		this.router.post('/addFranchiseTeller', (req, res) =>{
			
			const { data, fcode } = req.body
			
			const type = "FRT"

			try{
				connection.beginTransaction()
				return new Promise((resolve)=>{
					connection.query("SELECT * from branch_count WHERE type=?", 
					['FRTeller'], (err, result) => {
						if(err) throw err
						
						resolve (result)
					})
				}).then(async(response:any)=>{
					
					const i = parseInt(response[0].count)+1
					
					
					const saltRounds : any = process.env.SALT_ROUNDS
					const password : any = process.env.STAT_PASSWORD
					const salt = bcrypt.genSaltSync(parseInt(saltRounds));
					const savePassword = bcrypt.hashSync(password, salt)

					await new Promise((resolve)=>{
						connection.query('SELECT branchCode FROM  franchise_list WHERE fbranchCode=?', [fcode], (err, result)=>{
							if (err) throw err;
							resolve(result)
						})
					}).then(async(result:any)=>{

						(!result.length)
				
						? res.status(Codes.SUCCESS).send({ message : 'notFound' }) 
				
						: await Promise.all([
							Promise.resolve(
								connection.query("INSERT INTO teller_list (branchCode, fiB_Code, tellerCode, type, firstname, lastname, contactNo, email, location, status, addedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
								[result[0].branchCode, fcode, type+('000'+i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 1, fcode ], (err, result) => {
									if(err) throw err;
									return result
								})
							), Promise.resolve(
								connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?) ",
								['Teller', type+('000'+i).slice(-4), savePassword, 1], (err, result)=>{
									if(err) throw err;
									return result
								})
							), Promise.resolve(
								connection.query("UPDATE branch_count SET count=? WHERE type=?",
								[i, 'FRTeller'], (err, result) => {
									if(err) throw err
									
									res.status(Codes.SUCCESS).send({ message : 'ok' })
								})
							)
						])
						connection.commit()
					})

				}).catch((err:any)=>{
					connection.rollback()
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}

			
			// const type = "FRT"
			// try {
			// 	connection.beginTransaction()
			// 	return new Promise((resolve, reject) => {
			// 		connection.query("SELECT * from branch_count WHERE type=?", 
			// 		['FRTeller'], (err, result) => {
			// 			if(err) throw err
						
			// 			resolve (result)
			// 		})
			// 	})
			// 	.then(async (responce: any) => {
			// 		const i = parseInt(responce[0].count)+1

			// 		const saltRounds : any = process.env.SALT_ROUNDS
			// 		const password : any = process.env.STAT_PASSWORD
			// 		const salt = bcrypt.genSaltSync(parseInt(saltRounds));
			// 		const savePassword = bcrypt.hashSync(password, salt)
					
			// 		await Promise.all([
			// 			Promise.resolve(
			// 				connection.query("INSERT INTO teller_list (branchCode, fiB_Code, tellerCode, type, firstname, lastname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
			// 				[branchCode, fbranchCode, type+('000'+i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 1 ], (err, result) => {
			// 					if(err) throw err;
			// 					return result
			// 				})
			// 			), Promise.resolve(
			// 				connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?) ",
			// 				['Teller', type+('000'+i).slice(-4), savePassword, 1], (err, result)=>{
			// 					if(err) throw err;
			// 					return result
			// 				})
			// 			), Promise.resolve(
			// 				connection.query("UPDATE branch_count SET count=? WHERE type=?",
			// 				[i, 'FRTeller'], (err, result) => {
			// 					if(err) throw err
								
			// 					return result
			// 				})
			// 			)
			// 		])
			// 		connection.commit()
			// 		res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
					
			// 	})
			// 	.catch((err) => {
            //         connection.rollback()
            //         res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
            //     })
			// } catch (err: any) { 
			// 	connection.rollback()
			// 	res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			// }
		})

		// get teller list
		this.router.get('/getTellerlist', async(req, res) =>{
			try{
				 connection.query('SELECT * FROM teller_list', (err, result) =>{
					if(err) throw err;

					res.status(Codes.SUCCESS).send(result)
				 })

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateStatusTeller', async (req, res)=>{
			const {data, approved_by} = req.body
			
			try{
				if(data.status == 1){
					connection.beginTransaction()
					return new Promise((resolve, reject)=>{

						connection.query("UPDATE teller_list SET status=? WHERE id=?",
						[0, data.id], (err, result) => {
							if(err) throw err;
							resolve(result)
							// res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					}).then(async(response:any)=>{

						connection.query("UPDATE user_account SET status=? WHERE username=?",[0, data.tellerCode],(err, result)=>{
							if(err) throw err;
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					})
					
				}else{

					connection.beginTransaction()
					return new Promise((resolve, reject)=>{

						connection.query("UPDATE teller_list SET status=? WHERE id=?",
						[1, data.id], (err, result) => {
							if(err) throw err;
							resolve(result)
						})
					}).then(async(response:any)=>{
						// update for user account
						connection.query("UPDATE user_account SET status=?, approved_by=? WHERE username=?", 
						[1, approved_by, data.tellerCode],(err, result)=>{
							connection.commit()
							res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
						})
					})
				}
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
			
		})

		this.router.post('/updateTeller_list', async (req, res) => {

			const {firstname, lastname, contactNo, email, locationAddress, id} = req.body	
			
			try {
				await Promise.resolve(
					connection.query("UPDATE teller_list SET firstname=?, lastname=?, contactNo=?, email=?, location=? WHERE id=?",
					[firstname, lastname, contactNo, email, locationAddress, id], (err, result) => {
						if(err) throw err;
						res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Updates.`)
					})
				)
			} catch (err: any) {
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}	
		})
		this.router.post('/saveIbarangayForapproval',async (req, res) => {
			const { data, franchiseCode, branchCode } = req.body
			const type = 'BRA'
			try {
				connection.beginTransaction()
				return new Promise((resolve, reject) => {
					connection.query("SELECT * from branch_count WHERE type=?", 
					['iBarangay'], (err, result) => {
						if(err) throw err
						
						resolve (result)
					})
				})
				.then(async (responce: any) => {
					const i = parseInt(responce[0].count)+1
					
					await Promise.all([
						Promise.resolve(
							connection.query("INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
							[branchCode, franchiseCode, type+('000'+i).slice(-4), data.branchName, 'iBarangay', data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, 1 ], (err, result) => {
								if(err) throw err;
								return result
							})
						), Promise.resolve(
							connection.query("UPDATE branch_count SET count=? WHERE type=?",
							[i, 'iBarangay'], (err, result) => {
								if(err) throw err
								
								return result
							})
						)
					])
					connection.commit()
					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
					
				})
				.catch((err) => {
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/getIbarangayForApproval',async (req, res) => {
			const { code }= req.body
			
			try{

				(code === 'admin')

				? await Promise.resolve(
					connection.query("SELECT * FROM ibrgy_list  WHERE status=? OR status=? ", [1, 2],(err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(result)
					})
				)
				
				: await Promise.resolve(
					connection.query("SELECT * FROM ibrgy_list WHERE branchCode=? AND status=? OR branchCode=? AND status=?", [code, 1, code, 2], (err, result)=>{
						if(err) throw err;
						res.status(Codes.SUCCESS).send(result)
					})
				)

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		this.router.post('/approvedIBstatus',async (req, res) => {
			const { id, code, wallet, dateApproved } = req.body

			const saltRounds : any = process.env.SALT_ROUNDS
			const password : any = process.env.STAT_PASSWORD
			const salt = bcrypt.genSaltSync(parseInt(saltRounds));
			const savePassword = bcrypt.hashSync(password, salt)

			try{
				connection.beginTransaction()
				return new Promise ((resolve, reject)=>{
					connection.query("UPDATE ibrgy_list SET status=?, date_approved=? WHERE ib_id=?", [0, dateApproved,  id], (err, result)=>{
						if(err) throw err
								
						resolve (result)
					})
				}).then(async (reponse:any) => {
					await Promise.all([
						Promise.resolve(

							connection.query("INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)", 
							[code, wallet, wallet], (err, result)=>{
								if(err) throw err;
								return result
							})
						), Promise.resolve(

							connection.query("INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?)",
							['iBarangay', code, savePassword, 0 ],(err, result)=>{
								if(err) throw err;
								return result
							})
						)
					])
					connection.commit()
					res.status(Codes.SUCCESS).send(`${ Message.SUCCESS } Added.`)
				})
				.catch((err) => {
                    connection.rollback()
                    res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
                })
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/declineiBarangay',async (req, res) => {
			const { id, dateDecline } = req.body		
			try{
				connection.query('UPDATE ibrgy_list SET status=?, date_decline=? WHERE ib_id = ?', [2, dateDecline, id], (err, result)=>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				})	
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/saveiB',async (req, res) => {
			const { data, fcode } = req.body			
			const type = 'BRA'
			try{
				connection.beginTransaction()
				return new Promise((resolve)=>{
					connection.query("SELECT * from branch_count WHERE type=?", 
					['iBarangay'], (err, result) => {
						if(err) throw err
						
						resolve (result)
					})
				}).then(async(response:any)=>{
					const i = parseInt(response[0].count)+1

					if(!response.length){
						res.status(Codes.SUCCESS).send({ message : 'undefined'})
					}else{

						await new Promise((resolve)=>{
							connection.query('SELECT branchCode FROM franchise_list WHERE fbranchCode=?', [fcode],(err,result)=>{
								if(err) throw err;
								resolve(result)
							})
						}).then(async(result:any)=>{
							
							(!result.length)
							? res.status(Codes.SUCCESS).send({ message : 'undefined' })
							
							:  await Promise.all([
								Promise.resolve(
									connection.query("INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
									[result[0].branchCode, fcode, type+('000'+i).slice(-4), data.branchName, 'iBarangay', data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, 1 ], (err, result) => {
										if(err) throw err;
										return result
									})
								), Promise.resolve(
									connection.query("UPDATE branch_count SET count=? WHERE type=?",
									[i, 'iBarangay'], (err, result) => {
										if(err) throw err
										
										res.status(Codes.SUCCESS).send({ message : 'ok'})
									})
								)
							])
							connection.commit()
						})
					}
					
				}).catch((err:any)=>{
					connection.rollback()
					res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)	
				})
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/addIbarangayTeller',async (req, res) => {
			const { data, ibCode } = req.body
			const type = 'BRT'
			try{
				connection.beginTransaction()
				return new Promise((resolve, reject)=>{
					connection.query("SELECT * from branch_count WHERE type=?", 
					['BRTeller'], (err, result) => {
						if(err) return reject(err)	
						resolve (result)
					})
					
				}).then(async(response:any)=>{
					if(!response.length){
						res.status(Codes.SUCCESS).send({ message : 'notFound'})
					
					}else{

						const i = parseInt(response[0].count)+1
						const saltRounds : any = process.env.SALT_ROUNDS
						const password : any = process.env.STAT_PASSWORD
						const salt = bcrypt.genSaltSync(parseInt(saltRounds));
						const savePassword = bcrypt.hashSync(password, salt)

						await new Promise((resolve, reject)=>{
							connection.query("SELECT * FROM ibrgy_list WHERE ib_ibrgyyCode=?", [ibCode], (err, result)=>{
								if (err) return reject(err)
								resolve(result)
							})
						}).then(async(res:any)=>{
							await Promise.all([
								Promise.resolve(
									connection.query("INSERT INTO teller_list (branchCode, ibrgy_code, tellerCode, type, firstname, lastname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
									[res[0].branchCode, ibCode, type+('000'+i).slice(-4), 'Teller', data.firstname, data.lastname, data.contactNo, data.email, data.locationAddress, 0 ], (err, result) => {
										if(err) throw err;
										return result
									})
								), Promise.resolve(
									connection.query("INSERT INTO user_account (user_type, username, password) VALUES (?, ?, ?) ", 
									['Teller', type+('000'+i).slice(-4), savePassword], (err, result)=>{
										if(err) throw err;
										return result
									})
								), Promise.resolve(
									connection.query("UPDATE branch_count SET count=? WHERE type=?",
									[i, 'BRTeller'], (err, result) => {
										if(err) throw err
										
										return result
									})
								)
							])
						})
					}
					
					res.status(Codes.SUCCESS).send({ message : 'ok'})
					connection.commit()
				})
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
		})
	}    
	/**
	 * endwatchBlock
	 */
    get routerObject() { return this.router }
}


const user = new BranchController()

user.watchRequests()
export default user.routerObject



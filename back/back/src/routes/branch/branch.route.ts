import express, { response } from 'express'
import { Router } from 'express-serve-static-core'

import { connection } from './../../configs/database.config'
import { Message, Codes } from '../../utils/main.enums'
import { authenticationToken } from '../../middleware/auth'
import bcrypt from 'bcrypt'

const saltRounds : any = process.env.SALT_ROUNDS
const password : any = process.env.STAT_PASSWORD
const salt = bcrypt.genSaltSync(parseInt(saltRounds));
const savePassword = bcrypt.hashSync(password, salt)
interface data {
	res : Array<object>
}
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
const updateStatusTeller = async(data:any, approved_by:any) =>{
	
	let id = data.status === 1 ? 0 : 1
	let Query = "UPDATE teller_list SET status=? WHERE id=?"
	let value = [id, data.id]

	/** */
	let Query1 = "UPDATE user_account SET status=? WHERE username=?"
	let values1 = [0, data.tellerCode]

	const response :any = await customQuery(Query, value)
	
	return  response.affectedRows === 0 ? await  customQuery(Query1, values1) : { message : 'notFound'}
	
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

		this.router.post('/saveBranch', authenticationToken, async (req, res) => {
			
			const { data, reference } = req.body
			const type = 'BH'
			try {
				connection.beginTransaction()
				let Query = "SELECT * from branch_count WHERE type=?"
				let value = ['Branch Head']
				const response :any = await customQuery(Query, value)
				
				if(!response.length){
					res.status(Codes.NOTFOUND).send({ message : 'notFound' })
				}else{
					const i = response[0].count + 1
					const count = `${type}${String(i).padStart(4, '0')}`
					
					let Query1 = "INSERT INTO branch_list(ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, branchType, branchCode) VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
					let value1 = [data.ownerFirstname, data.ownerLastname, data.contactNo, data.emailAdd, data.address, data.branchName, 'Branch Head',count]

					const response1 :any = await customQuery(Query1, value1)
					/** */
					let Query2 = "INSERT INTO user_account(user_type, username, password, status) VALUES (?, ?, ?, ?)"
					let value2 = [ 'Branch Head', count, savePassword, 1]
					const response2 :any = response1.affectedRows > 0 ? await customQuery(Query2, value2)  : ''
					
					/** */
					let Query3 = "UPDATE branch_count SET count=? WHERE type=?"
					let values3 = [i, 'Branch Head']
					const response3 :any = response2.affectedRows > 0  ? await customQuery(Query3, values3) : ''
					response3.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
				}
				connection.commit()
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}

		})

		this.router.get('/getBranches',authenticationToken, async (req, res) => {
			try {
				connection.query("SELECT * FROM branch_list", (err, result) => {
					if(err) throw err;

					res.status(Codes.SUCCESS).send(result)
				})
			} catch (err: any) {
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		this.router.post('/updateBranch',authenticationToken, async (req, res) => {
			const { ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, id } = req.body
			
			try {
				connection.beginTransaction()
				let Query = "UPDATE branch_list SET ownerFirstname=?, ownerLastname=?, contactNo=?, emailAdd=?, address=?, branchName=? WHERE b_id=?"
				let values = [ownerFirstname, ownerLastname, contactNo, emailAdd, address, branchName, id]

				const response :any = await customQuery(Query, values)

				response.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''

				connection.commit()
			} catch (err: any) {
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}	
		})
		this.router.post('/updateBranchStatus',authenticationToken, async (req, res) => {
			const {data, loggedBy} = req.body


			
			try{
				connection.beginTransaction()
				const id = data.branchStatus === 1 ? 0 : 1
				let Query = "UPDATE branch_list SET branchStatus=? WHERE b_id=?"
				let values = [id, data.b_id]

				const response :any = await customQuery(Query, values)
				/** */
				let Query1 = "UPDATE user_account SET status =? WHERE username =?"
				let values1 = [id, data.branchCode]

				const response1 :any = response.affectedRows > 0 ? await customQuery(Query1, values1) : ''
				response1.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message :'ok' }) : ''
				connection.commit()
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		// end of Branch Head Query

		// start of Franchise query
		this.router.post('/saveFbranch',authenticationToken, async(req, res) => {
			const type = "FRA"
			const { firstname, lastname, contactNo, email, locationAddress, branchName, code } = req.body

			try {
				connection.beginTransaction()
				let Query = "SELECT * from branch_count WHERE type=?"
				let value = ['Franchise']
				const response :any = await customQuery(Query, value)
				const i = parseInt(response[0].count)+1
				const series = `${type}${String(i).padStart(4, '0')}`

				/** */
				let Query1 = "INSERT INTO franchise_list (branchCode, fbranchCode, franchiseName, fbranchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
				let value1 = [code, series, branchName, 'Franchise', lastname, firstname, contactNo, email, locationAddress, 1 ]
				if(!response.length){
					res.status(Codes.NOTFOUND).send({ message : 'notFound' })
				}else{
					const response1 :any = await customQuery(Query1, value1) 

					/** */
					let Query2 = "INSERT INTO user_account(user_type, username, password, status) VALUES (?, ?, ?, ?)"
					let values2 = ['Franchise', series, savePassword, 1]
					const response2 :any = response1.affectedRows > 0 ? await customQuery(Query2, values2)  : ''
					
					/** */
					let Query3 = "UPDATE branch_count SET count=? WHERE type=?"
					let value3 = [i, 'Franchise']

					const response3 :any = response2.affectedRows > 0 ? await customQuery(Query3, value3) : ''
					
					response3.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
					connection.commit()
				}
				
					
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})
		/**
		 * @franchiseList
		 */
		this.router.get('/getFranchiselist',authenticationToken, async(req, res) =>{
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
		this.router.post('/savefWallet',authenticationToken, async(req, res) =>{
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
		this.router.post('/saveibWallet',authenticationToken, async(req, res)=>{
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
		this.router.post('/updateFbranchStatus',authenticationToken, async (req, res) => {
			const {data, approved_by} = req.body
			
			try{
				connection.beginTransaction()
				const id = data.status === 1 ? 0 : 1
				let Query =  "UPDATE franchise_list SET status=? WHERE id=?"
				let value = [id, data.id]
				
				const response :any = await customQuery(Query, value)

				/** */
				let Query1 = "UPDATE user_account SET status=?, approved_by=? WHERE username=?"
				let value1 = [id, approved_by, data.fbranchCode]

				const response1 :any = response.affectedRows > 0 ? await customQuery(Query1, value1) : ''

				response1.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
				connection.commit()
			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateFbranch',authenticationToken, async (req, res)=>{
			const { data } = req.body
			try{
				connection.beginTransaction()
				let Query = 'UPDATE franchise_list SET franchiseName=?, lastname =?, firstname =?, contactNo =?, email =?, location =? WHERE id =?'
				let values = [data.branchName, data.lastname, data.firstname, data.contactNo, data.email, data.locationAddress, data.id ]
				const response :any = await customQuery(Query, values)
				response.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
				connection.commit()
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
			
		})

		this.router.post('/saveIbarangay',authenticationToken, async(req, res) =>{
			const type = "BRA"
			const { branchCode, fbranchCode, branchName, lastname, firstname, suffix,  contactNo, email, locationAddress }  = req.body
			try {
				connection.beginTransaction()

				let Query = "SELECT * from branch_count WHERE type=?"
				let values = ['iBarangay']

				const response :any = await customQuery(Query, values)
				const i = parseInt(response[0].count)+1
				const series = `${type}${String(i).padStart(4, '0')}`
				if(!response.length){
					res.status(Codes.NOTFOUND).send({ message :'notFound' })
				}else{
					let Query1 = "INSERT INTO ibrgy_list (branchCode, ib_fbranchCode, ib_ibrgyyCode, franchiseName, branchType, lastname, firstname, contactNo, email, location, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
					let value1 = [branchCode, fbranchCode, series, branchName, 'iBarangay', lastname, firstname, contactNo, email, locationAddress, 1 ]
					const response1 :any = await customQuery(Query1, value1)
					/** */
					let Query2 = "INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?)"
					let value2 =  ['iBarangay', series, savePassword, 1]
					const response2 :any = response1.affectedRows > 0 ? await customQuery(Query2, value2) : ''
					/** */
					let Query3 = "UPDATE branch_count SET count=? WHERE type=?"
					let value3 = [i, 'iBarangay']

					const response3:any = response2.affectedRows > 0 ? await customQuery(Query3, value3) : ''

					response3.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
					
				}
				connection.commit()
			} catch (err: any) {
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.get('/getIbarangaylist', authenticationToken ,async(req, res) =>{
			try{
				 connection.query('SELECT * FROM ibrgy_list', (err, result) =>{
					if(err) throw err;
					res.status(Codes.SUCCESS).send(result)
				 })

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			
				
			}
		})

		this.router.post('/updateStatusIb',authenticationToken, async (req, res)=>{
			const { data, approved_by} = req.body
			
			try{
				connection.beginTransaction()
				const id = data.status === 1 ? 0 : 1 
				let Query = "UPDATE ibrgy_list SET status=? WHERE ib_id=?"
				let value = [id, data.ib_id]
				/**next query */
				let Query1 = "UPDATE user_account SET status=?, approved_by=? WHERE username=?"
				let values =[id, approved_by, data.ib_ibrgyyCode]

				const response :any = await customQuery(Query, value)
				
				const result :any = response.affectedRows > 0 ? await customQuery(Query1, values) : ''
				result.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
				connection.commit()

			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
			
		})

		this.router.post('/updateIbarangaylist',authenticationToken, async (req, res)=>{
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

		this.router.post('/addibTeller',authenticationToken, async(req, res) =>{
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
		this.router.post('/addFranchiseTeller',authenticationToken, async (req, res) =>{
			
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
		})

		// get teller list
		this.router.get('/getTellerlist',authenticationToken, async(req, res) =>{
			try{
				
				 connection.query('SELECT * FROM user_account INNER JOIN teller_list ON user_account.username = teller_list.tellerCode', (err, result) =>{
					if(err) throw err;

					res.status(Codes.SUCCESS).send(result)
				 })

			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/updateStatusTeller',authenticationToken, async (req, res)=>{
			const {data, approved_by} = req.body
			
			try{
				connection.beginTransaction()
				let id = data.status === 1 ? 0 : 1
				let Query = "UPDATE teller_list SET status=? WHERE id=?"
				let value = [id, data.id]

				/** */
				let Query1 = "UPDATE user_account SET status=? WHERE username=?"
				let values1 = [id, data.tellerCode]

				const response :any = await customQuery(Query, value)
				
				const response1 :any = response.affectedRows > 0 ? await  customQuery(Query1, values1) : { message : 'notFound'}
				response1.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) :''
				connection.commit()
			}catch(err:any){
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
				connection.rollback()
			}
			
		})

		this.router.post('/updateTeller_list',authenticationToken, async (req, res) => {

			const {firstname, lastname, contactNo, email, locationAddress, id} = req.body	
			
			try {
				connection.beginTransaction()
				let Query = "UPDATE teller_list SET firstname=?, lastname=?, contactNo=?, email=?, location=? WHERE id=?"
				let value = [firstname, lastname, contactNo, email, locationAddress, id]
				const response :any = await customQuery(Query, value)
				
				response.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message :'ok' }) : ''
				connection.commit()
			} catch (err: any) {
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}	
		})
		this.router.post('/saveIbarangayForapproval' ,authenticationToken,async (req, res) => {
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

		this.router.post('/getIbarangayForApproval',authenticationToken,async (req, res) => {
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
		this.router.post('/approvedIBstatus' ,authenticationToken,async (req, res) => {
			const { id, code, wallet, dateApproved } = req.body


			try{
				connection.beginTransaction()
				let Query = "UPDATE ibrgy_list SET status=?, date_approved=? WHERE ib_id=?"
				let values = [0, dateApproved,  id]
				const response :any = await customQuery(Query, values)

				/** */
				let Query1 = "INSERT INTO wallet (branchCode, approved_wallet, current_wallet) VALUES (?, ?, ?)"
				let value1 = [code, wallet, wallet] 
				const response1 :any = response.affectedRows > 0 ? await customQuery(Query1, value1) : ''
				/** */
				let Query2 = "INSERT INTO user_account (user_type, username, password, status) VALUES (?, ?, ?, ?)"
				let value2 = ['iBarangay', code, savePassword, 0 ]
				const response2 :any = response1.affectedRows > 0 ? await customQuery(Query2, value2) : ''
				response2.affectedRows > 0 ? res.status(Codes.SUCCESS).send({ message : 'ok' }) : ''
				connection.commit()

			}catch(err:any){
				connection.rollback()
				res.status(err.status || Codes.INTERNAL).send(err.message || Message.INTERNAL)
			}
		})

		this.router.post('/declineiBarangay' ,authenticationToken,async (req, res) => {
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

		this.router.post('/saveiB' ,authenticationToken,async (req, res) => {
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

		this.router.post('/addIbarangayTeller',authenticationToken,async (req, res) => {
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



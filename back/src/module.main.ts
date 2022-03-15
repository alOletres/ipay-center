import { Express } from 'express-serve-static-core'
// import cors from 'cors'

import User from './routes/user/user.route'
import Branch from './routes/branch/branch.route'
import Wallets from './routes/wallets/wallet.route'
import Barkota from './routes/barkota/barkota.router'

import Admin from './routes/transactions/dashboard/admin.route'
export default class MainModule {
	private branch = 'branch'
    private user = 'user'
	private wallet = 'wallet'
	private barkota = 'barkota'
	private admin = 'admin'

    constructor(private app : Express) {
		// this.branch = 'branch'
		// this.user = 'user'
		// this.wallet = 'wallet'

		this.app.use(`/${ this.branch }/branchs`, Branch )

		this.app.use(`/${ this.user }/users`, User )

		this.app.use(`/${ this.wallet }/wallets`, Wallets)
		
		this.app.use( `/${ this.admin }/admins`, Admin )
		// api 
		this.app.use(`/${this.barkota}/barkotas`, Barkota)
		
    }

}

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import cors from 'cors'
const user_route_1 = __importDefault(require("./routes/user/user.route"));
const branch_route_1 = __importDefault(require("./routes/branch/branch.route"));
const wallet_route_1 = __importDefault(require("./routes/wallets/wallet.route"));
const barkota_router_1 = __importDefault(require("./routes/barkota/barkota.router"));
const admin_route_1 = __importDefault(require("./routes/transactions/dashboard/admin.route"));
class MainModule {
    constructor(app) {
        // this.branch = 'branch'
        // this.user = 'user'
        // this.wallet = 'wallet'
        this.app = app;
        this.branch = 'branch';
        this.user = 'user';
        this.wallet = 'wallet';
        this.barkota = 'barkota';
        this.admin = 'admin';
        this.app.use(`/${this.branch}/branchs`, branch_route_1.default);
        this.app.use(`/${this.user}/users`, user_route_1.default);
        this.app.use(`/${this.wallet}/wallets`, wallet_route_1.default);
        this.app.use(`/${this.admin}/admins`, admin_route_1.default);
        // api 
        this.app.use(`/${this.barkota}/barkotas`, barkota_router_1.default);
    }
}
exports.default = MainModule;
//# sourceMappingURL=module.main.js.map
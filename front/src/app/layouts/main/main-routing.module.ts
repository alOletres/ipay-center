import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
/**
 * guards
 */
import { CanActivateGuard } from "./../../guards/can-activate.guard";
import { DeActivateGuard } from "./../../guards/de-activate.guard";
/**
 * routing components
 */
import { WrapperComponent } from "./../../pages/wrapper/wrapper.component";
import { DashboardComponent } from "./../../pages/dashboard/dashboard.component";
import { UsermastersComponent } from "./../../pages/usermasters/usermasters.component";
import { BranchmasterComponent } from "./../../pages/branchmaster/branchmaster.component";
import { AddfranchiseComponent } from "./../../pages/addfranchise/addfranchise.component";
import { NotifylistComponent } from "./../../pages/notifylist/notifylist.component";
import { TransactionComponent } from "./../../pages/transaction/transaction.component";
import { ManageservicesComponent } from './../../pages/manageservices/manageservices.component';
import { AdminBarkotaComponent } from './../../pages/api/barkota/admin-barkota/admin-barkota.component';
import { SettingsComponent } from './../../globals/globa_components/settings/settings.component';
import { MacsettingsComponent } from './../../pages/macsettings/macsettings.component';
import { IbarangayComponent } from 'src/app/pages/ibarangay/ibarangay.component';
import { LoadCentralHistoryComponent } from './../../pages/transaction/load-central-history/load-central-history.component';
import { TopuploadListComponent } from './../../pages/transaction/topupload-list/topupload-list.component';
import { WalletHistoryComponent } from './../../pages/transaction/wallet-history/wallet-history.component';
import { CommissionComponent } from './../../pages/transaction/commission/commission.component';
import { ServicesListComponent } from './../../pages/services-list/services-list.component';
import { GovbillpaymentComponent } from './../../pages/transaction/govbillpayment/govbillpayment.component';
const routes: Routes = [
	{
		path: '',
		canActivate: [CanActivateGuard],
		component: WrapperComponent,
		canDeactivate: [DeActivateGuard],
		children: [
			{
				path: '',
				redirectTo: '/dashboard',
				pathMatch: 'full'
			}, {
				path: 'dashboard',
				component: DashboardComponent
			}, {
				path: 'usermasters',
				component: UsermastersComponent
			}, {
				path: 'branchmaster',
				component: BranchmasterComponent,
			}, {
				path: 'addfranchise',
				component: AddfranchiseComponent
			}, {
				path: 'notify',
				component : NotifylistComponent
			}, {
				path: 'transactions',
				component : TransactionComponent
			},{
				path :'services',
				component : ManageservicesComponent
			},{
				path : 'settings',
				component : SettingsComponent
			}, {
				path : 'barkota',
				component : AdminBarkotaComponent
			}, {
				path : 'macsettings',
				component : MacsettingsComponent
			}, {
				path : 'ibarangay',
				component : IbarangayComponent
			}, {
				path : 'topuploadList',
				component : TopuploadListComponent
			}, {
				path : 'loadcentralHistory',
				component : LoadCentralHistoryComponent
			}, {
				path : 'walletHistory',
				component : WalletHistoryComponent
			}, {
				path : 'commisionpage',
				component :  CommissionComponent
			}, {
				path :'SERVICES',
				component : ServicesListComponent
			}, {
				path:'billspayment',
				component : GovbillpaymentComponent
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class MainRoutingModule { }

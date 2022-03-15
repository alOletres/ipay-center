import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';

/**
 * Angular Material
 */
import { CommonModule } from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatRadioModule} from '@angular/material/radio';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatButton, } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatStepperModule } from "@angular/material/stepper"
import {MatChipsModule} from '@angular/material/chips';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MainRoutingModule } from './main-routing.module'; // Routing Main Module
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ChartsModule } from 'ng2-charts';
import { SnackbarComponent } from "./../../components/snackbar/snackbar.component";  // SnackbarComponent for pop-ups/notifications
/**
 * components
 */
import { HeaderComponent } from './../../components/header/header.component';
import { SidebarComponent } from './../../components/sidebar/sidebar.component';
import { UserComponent } from "./../../components/user/user.component";
import { FooterComponent } from "./../../components/footer/footer.component";
import { WrapperComponent } from "./../../pages/wrapper/wrapper.component";
import { DashboardComponent } from './../../pages/dashboard/dashboard.component';
import { UsermastersComponent } from "./../../pages/usermasters/usermasters.component";
import { BranchmasterComponent } from "./../../pages/branchmaster/branchmaster.component";
import { AddfranchiseComponent } from "./../../pages/addfranchise/addfranchise.component";
import { AdminBarkotaComponent } from './../../pages/api/barkota/admin-barkota/admin-barkota.component';
import { AddbranchComponent } from "./../../globals/globa_components/addbranch/addbranch.component";
import { BranchlistComponent } from "./../../globals/globa_components/branchlist/branchlist.component";
import { GlobalDialogComponent } from './../../components/global-dialog/global-dialog.component';
import { FranchiselistComponent } from './../../globals/globa_components/franchiselist/franchiselist.component';
import { StepperComponent } from './../../components/stepper/stepper.component';
import { NotifylistComponent } from "./../../pages/notifylist/notifylist.component";
import { TransactionComponent } from './../../pages/transaction/transaction.component';
import { ModalComponent } from './../../components/modal/modal.component' 
import { DialogComponent } from './../../globals/globa_components/dialog/dialog.component';
import { ManageservicesComponent } from './../../pages/manageservices/manageservices.component';
import { ServicedialogComponent } from './../../globals/globa_components/servicedialog/servicedialog.component';
import { ViewdialogComponent } from './../../globals/globa_components/viewdialog/viewdialog.component';
import { MacsettingsComponent } from './../../pages/macsettings/macsettings.component';
import { SettingsComponent } from './../../globals/globa_components/settings/settings.component';
import { IbarangayComponent } from 'src/app/pages/ibarangay/ibarangay.component';

import { TopuploadListComponent } from './../../pages/transaction/topupload-list/topupload-list.component';
import { TellerComponent } from './../../pages/teller/teller.component';
/**
 * pipes
 */
import { ImgPipe } from './../../pipes/img.pipe';
import { imgpipes } from './../../pipes/img.pipe';
import { ComputeDebitPipe, ComputeTotalDebitPipe, ComputeTotalCreditAdminPipe, ComputeTotalCreditBranchPipe, SearchByDateAdminPipe} from './../../pipes/admin/compute-debit.pipe'
/**
 * directives
 */

 import { ActivitylogsDirective } from './../../components/directive/activitylogs.directive';

 import { BranchCodeDirective } from './../../components/directive/branch-code.directive';

 import { NgxLoadingModule } from 'ngx-loading';
 import { ngxLoadingAnimationTypes } from 'ngx-loading';

@NgModule({
	declarations: [
		HeaderComponent,
		SidebarComponent,
		UserComponent,
		FooterComponent,
		SnackbarComponent,
		WrapperComponent,
		DashboardComponent,
		UsermastersComponent,
		AddbranchComponent,
		BranchlistComponent,
		BranchmasterComponent,
		AddfranchiseComponent,
		GlobalDialogComponent,
		FranchiselistComponent,
		StepperComponent,
		NotifylistComponent,
		TransactionComponent,
		ModalComponent,
		DialogComponent,
		ManageservicesComponent,
		ServicedialogComponent,
		IbarangayComponent,
		ImgPipe,
		imgpipes,
		ViewdialogComponent,
		SettingsComponent,
		AdminBarkotaComponent,
		MacsettingsComponent,
		ComputeDebitPipe,
		ComputeTotalDebitPipe,
		ComputeTotalCreditAdminPipe,
		ComputeTotalCreditBranchPipe,
		SearchByDateAdminPipe,
		TellerComponent,
		ActivitylogsDirective,
		BranchCodeDirective,
		TopuploadListComponent
		
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		MatNativeDateModule,
		FlexLayoutModule,
		MatToolbarModule,
		MatFormFieldModule,
		MatInputModule,
		MatBadgeModule,
		MainRoutingModule,
		MatListModule,
		MatIconModule,
		RouterModule,
		MatButtonModule,
		MatMenuModule,
		MatSelectModule,
		MatSidenavModule,
		MatExpansionModule,
		MatCardModule,
		MatTableModule,
		MatTabsModule,
		MatDialogModule,
		MatSnackBarModule,
		MatPaginatorModule,
		MatProgressBarModule,
		MatProgressSpinnerModule,
		MatSlideToggleModule,
		MatStepperModule,
		MatTooltipModule,
		MatChipsModule,
		MatButtonToggleModule,
		AngularFileUploaderModule,
		NgxDropzoneModule,
		MatDatepickerModule,
		MatRadioModule,
		MatGridListModule,
		ChartsModule,
		MatAutocompleteModule,
		NgxLoadingModule.forRoot({
			animationType: ngxLoadingAnimationTypes.wanderingCubes,
			backdropBackgroundColour: 'rgba(0,0,0,0.5)',
			backdropBorderRadius: '4px',
			primaryColour: '#ffffff',
			secondaryColour: '#ffffff',
			tertiaryColour: '#ffffff',
			fullScreenBackdrop: false,
		  }),
		
	],
	entryComponents: [
		SnackbarComponent
	],
	providers: [
		SearchByDateAdminPipe
	]
})
export class MainModule { }


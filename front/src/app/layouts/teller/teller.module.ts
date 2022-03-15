import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatRadioModule} from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { MatChipsModule} from '@angular/material/chips';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { TellerRoutingModule } from './teller-routing.module';
/**COMPONENTS */
import { TellermainComponent } from "./../../pages/tellermain/tellermain.component";
import { LoadingDialogComponent } from './../../components/loading-dialog/loading-dialog.component';
import { TellerservicesComponent } from './../../tellercomponents/tellerservices/tellerservices.component';
// import { TellerpagesComponent } from './../../tellercomponents/tellerpages/tellerpages.component';
import { BarkotaComponent } from './../../api/barkota/barkota.component';
import { DialogComponent } from './../../api/barkota/dialog/dialog.component';
import { SettingsComponent } from './../../api/barkota/settings/settings.component';
import { CotsdialogComponent } from './../../api/barkota/cotsdialog/cotsdialog.component';
import { TellersettingsComponent } from 'src/app/tellercomponents/tellersettings/tellersettings.component';
/** cookie service */ 
import {CookieService} from 'ngx-cookie-service';
/** pipe */
import { ArraypipePipe } from './../../pipes/arraypipe.pipe';
import { ComputePipe, ComputeSalesPipe, ComputeCollectionPipe, ComputeSalePipe, ComputeIncomePipe, SearchByDatePipe } from './../../pipes/compute.pipe';

import { ChartsModule } from 'ng2-charts';
import { ActivitylogsDirective } from './../../tellercomponents/directive/activitylogs.directive';
import { NgxPrintModule } from 'ngx-print';
@NgModule({
	declarations: [
		
		BarkotaComponent,
		TellermainComponent,
		TellerservicesComponent,
		DialogComponent,
		ArraypipePipe,
		ComputePipe,
		ComputeSalesPipe,
		ComputeCollectionPipe,
		LoadingDialogComponent,
		SettingsComponent,
		CotsdialogComponent,
		ComputeSalePipe,
		ComputeIncomePipe,
		SearchByDatePipe,
		ActivitylogsDirective,
		TellersettingsComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		TellerRoutingModule,
		FlexLayoutModule,
		MatToolbarModule,
		MatFormFieldModule,
		MatInputModule,
		MatBadgeModule,
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
		MatTooltipModule,
		MatStepperModule,
		MatChipsModule,
		MatButtonToggleModule,	
		MatDatepickerModule,
		MatCheckboxModule,
		MatRadioModule,
		ChartsModule,
		MatAutocompleteModule,
		NgxPrintModule
	],
	providers: [
		CookieService,
		SearchByDatePipe
	],
	 
		
})
export class TellerModule { }

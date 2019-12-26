import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NgxPaginationModule} from 'ngx-pagination';
import { CadastrosModule } from './cadastros/cadastros.module';
import { ModalModule ,TooltipModule, PopoverModule} from 'ngx-bootstrap'
import { DashboardRoutingModule } from './dashboard.routing.module';
import { NgbModule, NgbModal, NgbActiveModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule} from '@angular/forms';
import {ToastyModule} from 'ng2-toasty'; 
import { AuthGuard } from '../guard/auth.guard';
import { NgSelectModule } from '@ng-select/ng-select'; 
import { SidebarModule } from 'ng-sidebar'; 
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateSettingsModule } from 'app/shared/translate/translateSettings.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    CadastrosModule,
    NgSelectModule,
    NgbModule.forRoot(),
    ModalModule.forRoot(),
    PopoverModule.forRoot(),
    ToastyModule.forRoot(),
    TooltipModule.forRoot(),
    SidebarModule.forRoot(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    DashboardRoutingModule,
    NgxPaginationModule,
    TranslateSettingsModule
  ],
  declarations: [
    DashboardComponent,
    NavbarComponent
  ],
  providers: [
    NgbActiveModal,
    AuthGuard
  ],
})
export class DashboardModuleAdmin { }

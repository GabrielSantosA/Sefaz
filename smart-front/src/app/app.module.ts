import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as $ from 'jquery';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { ModalComponent } from './shared/modal/modal.component';
import { ModalRastComponent } from './shared/modal-rast/modal-rast.component';


import { PositionModalComponent } from './shared/modal/alerta/position/alerta.component';
import { MissingModalComponent } from './shared/modal/alerta/missing/alerta.component';

import { EmbalagensService } from './servicos/embalagens.service';
import { AlertsService } from './servicos/alerts.service';
import { DepartmentService } from './servicos/departments.service';
import { PackingService } from './servicos/packings.service';
import { PlantsService } from './servicos/plants.service';
import { RoutesService } from './servicos/routes.service';
import { SuppliersService } from './servicos/suppliers.service';
import { TagsService } from './servicos/tags.service';
import { CheckpointService } from './servicos/checkpoints.service';
import { ProjectService } from './servicos/projects.service';
import { ChatService } from './servicos/teste';
// import { AlertModule } from 'ngx-bootstrap';
// import { ModalModule } from 'ng2-bootstrap/ng2-bootstrap';

import { DashboardModule } from './dashboard/dashboard.module';
import { AppRoutingModule } from './app.routing.module';
import { EsqueciMinhaSenhaComponent } from './esqueci-minha-senha/esqueci-minha-senha.component';
import { RedefinirSenhaComponent } from './redefinir-senha/redefinir-senha.component';
import { ModalLegComponent } from './shared/modal-leg/modal-leg.component';
// import * as NG2Bootstrap from 'ng2-bootstrap';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    LandingPageComponent,
    ModalComponent,
    PositionModalComponent,
    ModalRastComponent,
    MissingModalComponent,
    EsqueciMinhaSenhaComponent,
    RedefinirSenhaComponent,
    ModalLegComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    DashboardModule,
  //   AlertModule.forRoot(),
  //   NG2Bootstrap.AlertModule,
  // NG2Bootstrap.ModalModule,
    AppRoutingModule
  ],
  providers: [
    EmbalagensService,
    AlertsService,
    DepartmentService,
    PackingService,
    PlantsService,
    RoutesService,
    SuppliersService,
    TagsService,
    CheckpointService,
    ProjectService,
    ChatService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent, ModalRastComponent,PositionModalComponent,MissingModalComponent]
})

export class AppModule { }

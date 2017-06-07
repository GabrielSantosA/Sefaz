import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgbModule, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';

import { ImportarComponent } from './importar/importar.component';
import { InventarioComponent } from './inventario/inventario.component';

import { EmbalagensService } from './servicos/embalagens.service';
import { AlertsService } from './servicos/alerts.service';
import { DepartmentService } from './servicos/departments.service';
import { PackingService } from './servicos/packings.service';
import { PlantsService } from './servicos/plants.service';
import { RoutesService } from './servicos/routes.service';
import { SuppliersService } from './servicos/suppliers.service';
import { TagsService } from './servicos/tags.service';

import { AppRoutingModule } from './app.routing.module';
import { HomeModule } from './home/home.module';
import { ModalComponent } from './shared/modal/modal.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ImportarComponent,
    InventarioComponent,
    ModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    NgbModule.forRoot(),
    HomeModule,
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
    TagsService

  ],
  bootstrap: [AppComponent],
  entryComponents: [ModalComponent]
})

export class AppModule { }

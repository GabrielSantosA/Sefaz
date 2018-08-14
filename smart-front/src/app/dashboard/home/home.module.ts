/**
 * Created by david on 7/09/17.
 */
import { NgModule } from '@angular/core';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { CommonModule } from '@angular/common'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule} from 'ngx-pagination';
import { ApplicationPipes } from '../../shared/pipes/application.pipes';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ResumoHomeComponent } from './resumo-home/resumo-home.component';
import { CategoriaPontosDeControleComponent } from './categoria-pontos-de-controle/categoria-pontos-de-controle.component';
import { CategoriaEmViagemComponent } from './categoria-em-viagem/categoria-em-viagem.component';
import { CategoriaSemSinalComponent } from './categoria-sem-sinal/categoria-sem-sinal.component';
import { CategoriaBateriaBaixaComponent } from './categoria-bateria-baixa/categoria-bateria-baixa.component';

@NgModule({
  imports: [
    HomeRoutingModule,
    CommonModule,
    NgxPaginationModule,
    NgxChartsModule,
    NgbModule
  ],
  declarations: [
    HomeComponent,
    ResumoHomeComponent,
    CategoriaPontosDeControleComponent,
    CategoriaEmViagemComponent,
    CategoriaSemSinalComponent,
    CategoriaBateriaBaixaComponent
  ],
})
export class HomeModule { }

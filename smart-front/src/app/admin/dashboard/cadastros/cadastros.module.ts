import { NgModule } from '@angular/core';
import { CadastrosComponent } from './cadastros.component';
import { CadastrosRoutingModule } from './cadastros.routing.module';
import {ToastyModule} from 'ng2-toasty'
import { AlertModule } from 'ngx-bootstrap/alert';

@NgModule({
  imports: [
    CadastrosRoutingModule,
    ToastyModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    CadastrosComponent
  ]
})
export class CadastrosModule { }

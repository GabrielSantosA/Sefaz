import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { HomeService } from '../../../servicos/home.service';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService } from '../../../servicos/index.service'; 
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-categoria-bateria-baixa',
  templateUrl: './categoria-bateria-baixa.component.html',
  styleUrls: ['./categoria-bateria-baixa.component.css']
})
export class CategoriaBateriaBaixaComponent implements OnInit {

  @Input() resume: any;

  public bateriaBaixaCollapsed: boolean = false;
  public bateriaCollapsed: boolean = false;
  public listBattery: any[] = [];
  public progressBateria: any = [];
  public listBatteryActualPage: number = -1;

  constructor(public translate: TranslateService, private homeService: HomeService) { 
    
    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {
    
    this.getListLowBattery();
  }

  ngOnChanges() {

    //console.log(this.resume);
    this.calculateProgress();
  }

  getListLowBattery() {
    
    this.homeService.getBatery().subscribe(result => {
      this.listBattery = result;
    }, err => { console.log(err) });
  }

  calculateProgress() {

    if (this.resume.qtd_total > 0) { 

      //Categoria em pontos de controle
      this.progressBateria[0] = ((parseFloat(this.resume.qtd_with_low_battery) / parseFloat(this.resume.qtd_total)) * 100);
      this.progressBateria[1] = (100 - this.progressBateria[0]);

    }else{
      this.progressBateria = [0, 100];
    }

    //console.log(this.progressBateria);
  }
}

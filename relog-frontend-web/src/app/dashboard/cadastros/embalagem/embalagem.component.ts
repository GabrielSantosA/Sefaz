import { Component, OnInit, Input } from '@angular/core';
import { PackingService, AuthenticationService, FamiliesService } from '../../../servicos/index.service';
import { Packing } from '../../../shared/models/packing';
import { Pagination } from '../../../shared/models/pagination';
import { ModalDeleteComponent } from '../../../shared/modal-delete/modal-delete.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-embalagem',
  templateUrl: './embalagem.component.html',
  styleUrls: ['../cadastros.component.css']
})
export class EmbalagemComponent implements OnInit {

  //list
  private _listOfPackings: any[] = [];
  public listOfPackings: any[] = [];

  //ng select
  public listOfFamilies: any[] = [];
  public selectedFamily: any;

  //pagination
  public actualPage = -1;

  public logged_user: any;

  constructor(public translate: TranslateService, private packingService: PackingService,
    private familyService: FamiliesService, private modalService: NgbModal,
    private auth: AuthenticationService) {

    //Session
    let user = this.auth.currentUser();

    this.logged_user = (user.supplier ? user.supplier._id : (
      user.official_supplier ? user.official_supplier : (
        user.logistic ? user.logistic.suppliers : (
          user.official_logistic ? user.official_logistic.suppliers : undefined)))); //works fine
  }

  changeLanguage() {
    console.log(this.translate.getLangs())
    console.log('changeLanguage')
    console.log('this.translate.currentLang', this.translate.currentLang)
    
    switch(this.translate.currentLang){
      case 'pt':
        console.log('pt');
        this.translate.use('en'); 
        console.log('use en');
        console.log('this.translate.currentLang', this.translate.currentLang)
        break;

      case 'en':
        console.log('en');
        this.translate.use('es'); 
        console.log('use es');
        console.log('this.translate.currentLang', this.translate.currentLang)
        break;

      case 'es':
        console.log('es');
        this.translate.use('pt'); 
        console.log('use pt');
        console.log('this.translate.currentLang', this.translate.currentLang)
        break;
    }

    console.log('\n\n\n')
  }

  ngOnInit() {
    this.loadPackings();
  }


  /**
   * Carregar todos os pacotes com paginação e sem filtro
   */
  loadPackings(): void {

    this.packingService.getAllPackings().subscribe(result => {

      this._listOfPackings = result;
      this.listOfPackings = result;
    }, err => { console.log(err) });
  }

  loadFamilies() {
    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  /**
   * Proceed to remove a packing
   * @param packing 
   */
  removePacking(packing): void {
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.mObject = packing;
    modalRef.componentInstance.mType = "PACKING";

    modalRef.result.then((result) => {
      this.loadPackings();
    });
  }


  searchEvent(event): void {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this._listOfPackings.filter(function (item) {
      return ((item.family.code.toLowerCase().indexOf(val) !== -1 || !val)
        || (item.serial.toLowerCase().indexOf(val) !== -1 || !val)
        || (item.tag.code.toLowerCase().indexOf(val) !== -1 || !val));
    });

    // update the rows
    this.listOfPackings = temp;
    // Whenever the filter changes, always go back to the first page
    this.actualPage = 0;
  }

}

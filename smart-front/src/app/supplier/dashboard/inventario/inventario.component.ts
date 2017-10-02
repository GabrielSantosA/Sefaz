import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { InventoryService } from '../../../servicos/inventory.service';
import { SuppliersService } from '../../../servicos/suppliers.service';
import { Pagination } from '../../../shared/models/pagination';
import { Alert } from '../../../shared/models/alert';
import { ModalInvComponent } from '../../../shared/modal-inv/modal-inv.component';
import { LayerModalComponent } from '../../../shared/modal-packing/layer.component';
import { AuthenticationService } from '../../../servicos/auth.service';
declare var $:any;

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit {
  public id : any;
  public suppliers: any;
  public name_supplier: any;
  public escolhaGeral: any = 'GERAL';
  public escolhaEquipamento =  "";
  public verModal: boolean = true;
  public escolhas: any[] = [
    {name: 'GERAL'},
    {name: 'EQUIPAMENTO'}];
  public general: Pagination = new Pagination({meta: {page : 1}});
  public supplier: Pagination = new Pagination({meta: {page : 1}});
  public battery: Pagination = new Pagination({meta: {page : 1}});
  public permanence: Pagination = new Pagination({meta: {page : 1}});
  public quantity: Pagination = new Pagination({meta: {page : 1}});
  public general_equipament: Pagination = new Pagination({meta: {page : 1}});
  public supplierSearch  = "";
  public batterySearch  = "";
  public quantitySearch  = "";
  public permanenceSearchEquipamento  = "";
  public permanenceSearchSerial  = "";
  public generalEquipamentSearch  = "";
  public serial = false;
  public activeModal : any;
  constructor(

    private inventoryService: InventoryService,
    private suppliersService: SuppliersService,
    private router: Router,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private modalActive: NgbActiveModal,
    private ref: ChangeDetectorRef,
  ) { }



  changeSelect(event){
    if(event === "Bateria"){
        this.batteryInventory();
    }else if(event === "Geral"){
        this.generalInventoryEquipament();
    }
  }

  tamanhoSelect(){
      $(window).resize(function(){
      var largura = $('.select2-container').width();
      var quadrado = $('.select2-container--open');
      quadrado.css({'width':'largura'});
    });
  }


// Bateria inventario  ----------------------------------
  batteryInventory(){

      this.inventoryService.getInventoryBattery(10,this.battery.meta.page,this.batterySearch,this.id).subscribe(result => this.battery = result, err => {console.log(err)});
  }

  generalInventoryEquipament(){
      this.inventoryService.getInventoryGeneralPackings(10,this.general_equipament.meta.page,this.generalEquipamentSearch,this.id).subscribe(result => {this.general_equipament = result; console.log(result)}, err => {console.log(err)});
  }

  quantityInventory(){
    if(this.quantitySearch){
        this.inventoryService.getInventoryQuantity(10,this.quantity.meta.page,this.quantitySearch,this.id).subscribe(result => {console.log(result);this.quantity = result}, err => {console.log(err)});
    }
  }

  generalInventory(){
      this.inventoryService.getInventoryGeneral(10,this.general.meta.page,this.id).subscribe(result => this.general = result, err => {console.log(err)});
  }

  choiced(event:any){
    if(event === "FORNECEDOR"){

    }
  }

  permanenceInventory(){
    if(this.permanenceSearchEquipamento && this.permanenceSearchSerial ){
      this.serial = true;
      this.inventoryService.getInventoryPackingHistoric(10,this.permanence.meta.page,this.permanenceSearchSerial,this.permanenceSearchEquipamento,this.id).subscribe(result => {
        this.permanence  = result;
       }, err => {console.log(err)});
    }else if(this.permanenceSearchEquipamento){
      this.serial = false;
      this.inventoryService.getInventoryPermanence(10,this.permanence.meta.page,this.permanenceSearchEquipamento,this.id).subscribe(result => this.permanence = result, err => {console.log(err)});
    }
  }

  open(packing) {
    const modalRef = this.modalService.open(ModalInvComponent);
    modalRef.componentInstance.packing = packing;
  }

  openLayer(packing) {
    const modalRef = this.modalService.open(LayerModalComponent);
    modalRef.componentInstance.packing = packing;
  }

  ngOnInit() {
    this.id = (this.auth.currentUser().supplier ? this.auth.currentUser().supplier._id : this.auth.currentUser().official_supplier);
    this.generalInventory();
    this.tamanhoSelect();
  }


  openHelp(content) {
   this.activeModal = this.modalService.open(content);
 }



}

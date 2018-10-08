import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Supplier } from '../../shared/models/supplier';
import { Profile } from '../../shared/models/profile';
import { Plant } from '../../shared/models/plant';
import { ModalSupplierRegisterComponent } from './modal-register-supplier/modal-register-supplier.component';
import { ModalStaffRegisterComponent } from './modal-register-staff/modal-register-staff.component';
import { ModalSupplierEditarComponent } from './modal-editar-supplier/modal-editar-supplier.component';
import { ModalLogisticEditarComponent } from './modal-editar-logistic/modal-editar-logistic.component';
import { ModalStaffEditarComponent } from './modal-editar-staff/modal-editar-staff.component';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { Pagination } from '../../shared/models/pagination';
import { AuthenticationService, ToastService, GeocodingService, CEPService, PlantsService, ProfileService, SuppliersService } from '../../servicos/index.service';
import { constants } from '../../../environments/constants';
declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  
  @Input() view;
  public userData: any[] = [];

  constructor(
    public activeModal: NgbActiveModal,
    private profileService: ProfileService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {

    this.getUsers();
    this.tamanho();
  }

  tamanho(){
    var mapa = $('.teste');
    var filho = $('.modalFilho');
    var pai1 = filho.parent();
    var pai2 = pai1.parent();
    var pai3 = pai2.parent();
    pai3.css({'max-width': '800px'});
  }

  getUsers(){
    
    this.profileService.getUsers().subscribe(result => {
      console.log('result: ' + result);
      //this.userData = result;
    });

    // if(this.authenticationService.currentUser().supplier){
    //   this.profileService.getProfilePaginationSupplier(10,this.userData.meta.page,this.authenticationService.currentUser().supplier._id).subscribe(result => {
    //     this.userData = result;
    //     //console.log('this.userData: ' + JSON.stringify(this.userData));
    //   });
    //   this.isAdmin = false;
      
    // }else if(this.authenticationService.currentUser().logistic){
    //   this.profileService.getProfilePaginationLogistic(10,this.userData.meta.page,this.authenticationService.currentUser().logistic._id).subscribe(result => {
    //     this.userData = result;
    //     //console.log('this.userData: ' + JSON.stringify(this.userData));
    //   });
    //   this.isAdmin = false;

    // }else{
    //   this.isAdmin = true;
    //   this.profileService.getProfilePagination(10,this.userData.meta.page).subscribe(result => {
    //     this.userData = result;
    //     //console.log('this.userData: ' + JSON.stringify(this.userData));
    //   });
    // }
  }


  editUser(user: any){
    if(user.profile === constants.SUPPLIER){
      const modalRef = this.modalService.open(ModalSupplierEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = user.user._id;
      this.activeModal.close();

    }else if(user.profile ===  constants.LOGISTIC){
      const modalRef = this.modalService.open(ModalLogisticEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = user.user._id;
      this.activeModal.close();

    }else{
      const modalRef = this.modalService.open(ModalStaffEditarComponent,{backdrop: "static", size: "lg"});
      modalRef.componentInstance.id = user._id;
      this.activeModal.close();
    }

  }

  addUsers(){
    if(this.isAdmin){
      const modalRef = this.modalService.open(ModalSupplierRegisterComponent, {backdrop: "static", size: "lg"});
    }else{
      const modalRef = this.modalService.open(ModalStaffRegisterComponent, {backdrop: "static", size: "lg"});
    }
    this.activeModal.close();
  }


  removeProfile(profile):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = profile;
    modalRef.componentInstance.type = "profile";
    modalRef.result.then((result) => {
      if(result === "remove") this.getUsers();
    });
  }

  // pageChanged(page: any): void{
  //   this.userData.meta.page = page;
  //   this.getUsers();
  // }

  isAdmin(user: any) {
    return user.role == 'admin';
  }

}

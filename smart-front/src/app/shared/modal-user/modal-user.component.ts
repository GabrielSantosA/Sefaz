import { Component, OnInit, Input ,ChangeDetectorRef} from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SuppliersService } from '../../servicos/suppliers.service';
import { ProfileService } from '../../servicos/profile.service';
import { PlantsService } from '../../servicos/plants.service';
import { CEPService } from '../../servicos/cep.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { Supplier } from '../../shared/models/supplier';
import { Profile } from '../../shared/models/profile';
import { Plant } from '../../shared/models/plant';
import { FormControl, FormGroup,Validators,FormBuilder } from '@angular/forms';
import { GeocodingService } from '../../servicos/geocoding.service';
import { ToastService } from '../../servicos/toast.service';
import { ModalDeleteComponent } from '../../shared/modal-delete/modal-delete.component';
import { Pagination } from '../../shared/models/pagination';

declare var $:any;

@Component({
  selector: 'app-modal-user',
  templateUrl: './modal-user.component.html',
  styleUrls: ['./modal-user.component.css']
})
export class ModalUserComponent implements OnInit {
  @Input() view;
  public next = false;
  public data: Pagination = new Pagination({meta: {page : 1}});
  private perfil = 'FORNECEDOR';
  public supplier:  FormGroup;
  public profile_edit:  FormGroup;
  public geocoder = new google.maps.Geocoder;
  public autocomplete: google.maps.places.Autocomplete;
  public address: any = {};
  public invalidEmail = false;
  public invalidDuns = false;
  public invalidPlant = false;
  public center: any;
  public pos : any;
  public users = [];
  public newcep = '';
  public newtelefone = '';
  public mask = [/[0-9]/, /\d/, /\d/,'.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/,'-', /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskTel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public maskCel = ['(', /[0-9]/, /\d/,')', /\d/,/\d/, /\d/, /\d/,/\d/,'.', /\d/, /\d/, /\d/, /\d/];
  public alerts: any = [];

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private router: Router,
    private modalService: NgbModal,
    private SuppliersService : SuppliersService,
    private ProfileService : ProfileService,
    private PlantsService : PlantsService,
    private CEPService : CEPService,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private geocodingService: GeocodingService,
    private toastService: ToastService

  ) { }

  ngOnInit() {
    if(this.view === "EDITAR"){
      this.profile_edit = this.fb.group({
        profile: ['',[Validators.required]],
        password: ['',[Validators.required]],
        email: ['',[Validators.required, Validators.email]],
        street: ['',[Validators.required]],
        city: ['',[Validators.required]],
        telephone: [''],
        cellphone: [''],
        neighborhood: ['',[Validators.required]],
        uf: ['',[Validators.required]],
        cep: ['',[Validators.required]],
        _id: ['',[Validators.required]],
        __v: ['',[Validators.required]]
      });

      (<FormGroup>this.profile_edit)
              .setValue(JSON.parse(localStorage.getItem('currentUser')), { onlySelf: true });

    }
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
      this.ProfileService.getProfilePagination(10,this.data.meta.page).subscribe(result => {console.log(result);this.data = result});
  }

  openAdd(){
      this.view = 'ADICIONAR';
      this.formProfile();
  }

  formProfile(){
    this.supplier = this.fb.group({
      name: ['',[Validators.required]],
      duns: ['',[Validators.required]],
      cnpj: [''],
      profile: this.fb.group({
        profile: ['',[Validators.required]],
        password: ['',[Validators.required]],
        email: ['',[Validators.required, Validators.email]],
        user: ['',[Validators.required]],
        street: ['',[Validators.required]],
        city: ['',[Validators.required]],
        telephone: [''],
        cellphone: [''],
        neighborhood: ['',[Validators.required]],
        uf: ['',[Validators.required]],
        cep: ['',[Validators.required]]
      }),
      plant: this.fb.group({
        plant_name: ['',[Validators.required]],
        lat: ['',[Validators.required]],
        lng: ['',[Validators.required]],
        location: ['',[Validators.required]]
      })
    });

  }

  closeAdd(){
      this.view = 'GERENCIAR';
      this.perfil ="FORNECEDOR";
      this.supplier.reset({ profile: {
        telephone:'',
        cellphone: ''
      }});
      this.next = false;
      this.formProfile();
      this.getUsers();
  }

  evaluateEmail(){
    this.ProfileService.retrieveProfileByEmail(this.supplier['controls'].profile['controls'].email.value).subscribe(result => {

      if(result.data.length > 0) {
        this.invalidEmail = true;
      }else{
        this.invalidEmail = false;
      };
    });
  }

  evaluateDuns(){
    this.SuppliersService.retrieveSupplierByDunsAndSupplier(this.supplier['controls'].duns.value,this.supplier['controls'].name.value).subscribe(result => {

      if(result.data.length > 0) {
        this.invalidDuns = true;
      }else{
        this.invalidDuns = false;
      };
    });
  }

  evaluatePlant(){
    this.PlantsService.retrievePlantByName(this.supplier['controls'].plant['controls'].plant_name.value).subscribe(result => {

      if(result.data.length > 0) {
        this.invalidPlant = true;
      }else{
        this.invalidPlant = false;
      };
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }):void {

      this.supplier['controls'].profile['controls'].profile.setValue("Supplier");
      value.profile.profile = "Supplier";

      if(this.supplier.valid && !this.invalidPlant && !this.invalidDuns && !this.invalidEmail){

        this.ProfileService.createProfile(value.profile).subscribe(result => {
          value.profile._id =  result.data._id;
          this.PlantsService.createPlant(value.plant).subscribe(result => {
            value.plant._id =  result.data._id;

            this.SuppliersService.createSupplier(value).subscribe(result => {
              value.plant.supplier = result.data._id ;
              this.PlantsService.updatePlant(result.data.plant, value.plant).subscribe(result => {this.toastService.successModal('Fornecedor');this.closeAdd()}, err => this.toastService.error(err));
            })

          })
        })
      }else{
        this.alerts.push({
          type: 'info',
          msg: 'Esta faltando algumas informações a serem cadastradas!',
          timeout: 5000
        });
      }

  }

  onMapReady(map) {
    let origin  = new google.maps.LatLng(map.center.lat(), map.center.lng());
    this.geocodingService.geocode(origin).subscribe(results => {
      // console.log(results[1].address_components.filter(o => o.types.indexOf("postal_code") == 0 ));
      // this.supplier['controls'].profile['controls'].cep.setValue(results[1].address_components.filter(o => o.types.indexOf("postal_code") == 0 )[0].long_name);
      this.supplier['controls'].plant['controls'].location.setValue(results[1].formatted_address);
      this.supplier.controls.plant['controls'].lat.setValue(map.center.lat());
      this.supplier.controls.plant['controls'].lng.setValue(map.center.lng());
      // this.getAddress();
    });

  }

  initialized(autocomplete: any) {
    this.autocomplete = autocomplete;
  }

  placeChanged(place) {
    this.center = place.geometry.location;
    for (let i = 0; i < place.address_components.length; i++) {
      let addressType = place.address_components[i].types[0];
      this.address[addressType] = place.address_components[i].long_name;
    }

    this.ref.detectChanges();
  }

  getAddress(){

    if(this.supplier['controls'].profile['controls'].cep.value){
      this.CEPService.getAddress(this.supplier['controls'].profile['controls'].cep.value).subscribe(result => {
         this.supplier['controls'].profile['controls'].neighborhood.setValue(result.data.bairro);
         this.supplier['controls'].profile['controls'].city.setValue( result.data.localidade);
         this.supplier['controls'].profile['controls'].uf.setValue(result.data.uf);
         this.supplier['controls'].profile['controls'].street.setValue(result.data.logradouro);
      })
    }
  }

  onClick(event, str) {
      if (event instanceof MouseEvent){
        return;
      }
     this.pos = event.latLng;
     this.geocodingService.geocode(event.latLng).subscribe(results => {

      //  this.supplier['controls'].profile['controls'].cep.setValue(results[1].address_components.filter(o => o.types.indexOf("postal_code") == 0 )[0].long_name);
       this.supplier['controls'].plant['controls'].location.setValue(results[1].formatted_address);
       this.supplier['controls'].plant['controls'].lat.setValue(event.latLng.lat());
       this.supplier['controls'].plant['controls'].lng.setValue(event.latLng.lng());
       event.target.panTo(event.latLng);
      //  this.getAddress();
     });

  }
  closeAll(){
    this.view='';
  }

  removeProfile(profile):void{
    const modalRef = this.modalService.open(ModalDeleteComponent);
    modalRef.componentInstance.view = profile;
    modalRef.componentInstance.type = "profile";
    modalRef.result.then((result) => {
      if(result === "remove") this.getUsers();
    });
  }

  pageChanged(page: any): void{
    this.data.meta.page = page;
    this.getUsers();
  }


}

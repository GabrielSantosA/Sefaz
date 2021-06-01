import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ViewChild } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Department } from '../../shared/models/department'; 
import { AuthenticationService, RackService, FamiliesService, ControlPointsService } from '../../servicos/index.service';
import { Pagination } from '../../shared/models/pagination'; 
import './markercluster';
import { Spiralize } from './Spiralize';

declare var $: any;
declare var google: any;
declare var MarkerClusterer: any;

//refatorar esse modulo esta muito grande e com coisas confusas
@Component({
  selector: 'app-rastreamento',
  templateUrl: './rastreamento.component.html',
  styleUrls: ['./rastreamento.component.css']
})

export class RastreamentoComponent implements OnInit {

  public data: Pagination = new Pagination({ meta: { page: 1 } });
  public logged_user: any;
  autocomplete: any;
  address: any = {};
  center: any = { lat: -15.793537, lng: -47.882803 }; //O mapa inicia centralizado no Brasil
  pos: any;

  departments: Department[];
  options = [];
  circles = [];
  zoom = 14;
  marker = {
    id: null,
    name: null,
    target: null,
    opt: null,
    display: true,
    lat: null,
    lng: null,
    rack: null
  };
  public packMarker = {
    display: true,
    position: null,
    lat: null,
    lng: null,
    start: null,
    rack_code: null,
    serial: null,
    battery: null,
    accuracy: null
  };

  numero: 1;
  plants = [];

  //selects
  public listOfSerials: any[];
  public codes: any[];

  //Bind dos selects
  public selectedCompany: any = null;
  public selectedFamily: any = null;
  public selectedSerial: any = null;

  //array de pinos
  public plotedRacks: any[] = [];
  public listOfControlPoints: any = [];

  //show markers
  public showControlledPlants: boolean = false;
  public showControlledLogistics: boolean = false;
  public showControlledSuppliers: boolean = false;
  public showRacks: boolean = false;

  //misc
  public settings: any = {};
  public permanence: Pagination = new Pagination({ meta: { page: 1 } });

  //...
  public listOfFamilies: any = [];
  public auxListOfFamilies: any = [];

  public listOfCompanies: any = [];

  constructor( 
    private controlPointsService: ControlPointsService, 
    private familyService: FamiliesService,
    private authenticationService: AuthenticationService,
    private rackService: RackService,  
    private auth: AuthenticationService) {

  }

  ngOnInit() {

    this.getPlantRadius();
    this.loadCompanies();
    this.loadControlPoints();
  }

  public mMap: any;
  onInitMap(map) {

    this.zoom = 14;
    this.mMap = map;
    this.loadRacks();
  }


  onChange(event) {
    this.center = { lat: event.lat, lng: event.lng };
    this.zoom = 14;
  }

  /**
   * Recupera o radius das plantas, configurado pelo usuário.
   */
  getPlantRadius() {

    let currentSetting = this.authenticationService.currentSettings();
    this.settings['range_radius'] = currentSetting.range_radius;
  }

  /**
   * Carrega as empresas no select de empresa
   */
  loadCompanies() {

    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result;
      this.auxListOfFamilies = result;

      // console.log('..');
      // console.log(result);
      let auxListOfCompanies = [];

      this.listOfCompanies = result.map(elem => {
        if (auxListOfCompanies.length < 1) {
          auxListOfCompanies.push(elem.company);
        } else {
          if (auxListOfCompanies.map(e => e._id).indexOf(elem.company._id) === -1)
            auxListOfCompanies.push(elem.company);
        }
      });

      // console.log(auxListOfCompanies);

      this.listOfCompanies = auxListOfCompanies;

    }, err => console.error(err));
  }

  public listOfCircleControlPoints: any = [];
  public listOfPolygonControlPoints: any = [];

  loadControlPoints(){

    this.controlPointsService.getAllControlPoint().subscribe(result => {
      // this.listOfControlPoints = result.map(elem => {
      //   elem.position = (new google.maps.LatLng(elem.lat, elem.lng));
      //   return elem;
      // });

      this.listOfCircleControlPoints = result
        .filter(elem => elem.geofence.type == 'c')
        .map(elem => {
          elem.position = (new google.maps.LatLng(elem.geofence.coordinates[0].lat, elem.geofence.coordinates[0].lng));
          return elem;
        });

      this.listOfPolygonControlPoints = result
        .filter(elem => elem.geofence.type == 'p')
        .map(elem => {

          let lat = elem.geofence.coordinates.map(p =>  p.lat);
          let lng = elem.geofence.coordinates.map(p =>  p.lng);

          elem.position = {
            lat: (Math.min.apply(null, lat) + Math.max.apply(null, lat))/2,
            lng: (Math.min.apply(null, lng) + Math.max.apply(null, lng))/2
          }

          return elem;
        });

      // console.log(this.listOfCircleControlPoints);
      // console.log(this.listOfPolygonControlPoints);

    }, err => console.error(err));
  }

  /**
   * Carrega todos os pacotes do mapa
   */
  public spiralPath: google.maps.Polyline = new google.maps.Polyline();
  public spiralPoints: any = [];
  public infoWin: google.maps.InfoWindow = new google.maps.InfoWindow();
  public mSpiralize: Spiralize;


  /**
   * An equipment was selected. This method fill the Serial Select.
   */
  loadSerialsOfSelectedEquipment() {

    // console.log('loadSerialsOfSelectedEquipment');
    // console.log(this.selectedFamily);

    if (this.selectedFamily) {
      //this.loadRacks();
      this.selectedSerial = null;
      this.listOfSerials = [];

      let query = { family: this.selectedFamily._id };

      this.rackService.getAllRacks(query).subscribe(result => {
        this.listOfSerials = result.filter(elem => {
          return elem.family.code == this.selectedFamily.code;
        });
      }, err => { console.log(err) })
    }
  }

  companyChanged(event: any){
    // console.log(event);

    if(event){
      this.listOfFamilies = this.auxListOfFamilies.filter(elem => {
        return elem.company._id == event._id;
      });
    } else{
      this.listOfFamilies = this.auxListOfFamilies;
    }

    this.loadRacks();
  }

  /**
   * The filter has changed
   */
  loadRacks() {

    // console.log('.'); 

    // let cp_id = this.selectedCompany !== null ? this.selectedCompany._id : null;
    let cp_id = null;
    let family_id = this.selectedFamily !== null ? this.selectedFamily._id : null;
    let serial_id = this.selectedSerial !== null ? this.selectedSerial : null;

    // console.log('\nthis.selectedCompany');
    // console.log(this.selectedCompany);

    // console.log('this.selectedCompany');
    // console.log(this.selectedFamily);

    // console.log('this.selectedSerial');
    // console.log(this.selectedSerial);

    this.rackService.getGeolocation(cp_id, family_id, serial_id).subscribe((result: any[]) => {

      this.plotedRacks = result.filter(elem => {
        if (elem.last_position)
          return true;
        else
          return false;
      });

      this.plotedRacks.map(elem => {
        elem.position = (new google.maps.LatLng(elem.last_position.latitude, elem.last_position.longitude));
        elem.latitude = elem.last_position.latitude;
        elem.longitude = elem.last_position.longitude;
        return elem;
      });

      //Se só há um objeto selecionado, centralize o mapa nele
      if (this.plotedRacks.length == 1){
        if (this.plotedRacks[0].last_position){
          this.center = { lat: this.plotedRacks[0].latitude, lng: this.plotedRacks[0].longitude }
        }
      }
      // console.log(JSON.stringify(this.plotedRacks));

      //this.resolveClustering();
      if (this.mSpiralize) {
        this.mSpiralize.clearState();
        this.mSpiralize.repaint(this.plotedRacks, this.mMap, false, this.showRacks);

      } else {
        this.mSpiralize = new Spiralize(this.plotedRacks, this.mMap, false);
      }
    });
  }

  /**
   * Exibir/Ocultar as fábricas
   */
  toggleShowPlants() {
    this.showControlledPlants = !this.showControlledPlants;
  }

  /**
   * Exibir/Ocultar os fornecedores
   */
  toggleShowSupplier() {
    this.showControlledSuppliers = !this.showControlledSuppliers;
  }

  /**
   * Exibir/Ocultar os operadores logísticos
   */
  toggleShowLogistic() {
    this.showControlledLogistics = !this.showControlledLogistics;
  }

  /**
   * Exibir/Ocultar as embalagens
   */
  toggleShowRacks() {

    this.showRacks = !this.showRacks;
    this.mSpiralize.toggleShowRacks(this.showRacks);
  }

  familyChanged(){
    this.selectedSerial = null; 
    this.loadRacks(); 
    this.loadSerialsOfSelectedEquipment();
  }

  /**
   * Equipment select was cleared.
   * Clear e disable the Serial Select.
   */
  onEquipmentSelectClear() {

    this.selectedSerial = null;
    this.loadRacks();
  }

  public racksByPlant: any[] = [];
  public racksByPlantActualPage: number = -1;

  clicked(_a, opt) {

    var marker = _a.target;
    //this.marker.target = _a
    this.marker.id = opt._id;
    this.marker.name = opt.name;
    this.marker.lat = marker.getPosition().lat();
    this.marker.lng = marker.getPosition().lng();

    this.rackService.racksOnControlPoint(opt._id).subscribe(result => {
      // console.log('');
      // console.log(result);
      this.racksByPlant = result;
      this.startWindow(marker);
    });
  }


  // open(id) {
  //   const modalRef = this.modalService.open(ModalRastComponent);
  //   modalRef.componentInstance.department = id;
  // }

  startWindow(marker) {
    marker.nguiMapComponent.openInfoWindow('iw', marker);
  }


  /**
   * Recupera o pino da embalagem de acordo com seu alerta
   */
  getPinWithAlert(status: any, smallSize:boolean = false) {
    let pin = null;

    switch (status) {
      case 'MISSING':
        pin = { url: 'assets/images/pin_ausente.png', size: (new google.maps.Size(29, 40)), scaledSize: (new google.maps.Size(29, 40)) }
        break;

      case 'INCORRECT_LOCAL':
        pin = { url: 'assets/images/pin_incorreto.png', size: (new google.maps.Size(29, 40)), scaledSize: (new google.maps.Size(29, 40)) }
        break;

      case 'LATE':
        pin = { url: 'assets/images/pin_atrasado.png', size: (new google.maps.Size(29, 40)), scaledSize: (new google.maps.Size(29, 40)) }
        break;

      case 'PERMANENCE_EXCEEDED':
        pin = { url: 'assets/images/pin_permanencia.png', size: (new google.maps.Size(29, 40)), scaledSize: (new google.maps.Size(29, 40)) }
        break;

      default:
        pin = { url: 'assets/images/pin_normal.png', size: (new google.maps.Size(29, 40)), scaledSize: (new google.maps.Size(29, 40)) }
        break;
    }

    if (smallSize){
      pin.size = (new google.maps.Size(21, 31));
      pin.scaledSize = (new google.maps.Size(21, 31));
    }

    return pin;
  }

  /**
   * Misc ...
   * Relative to side-menu
   */
  public _opened: boolean = true;

  public _toggleSidebar() {
    this._opened = !this._opened;
  }
}

import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { Pagination } from '../../../shared/models/pagination';
import { InventoryService, PackingService, AuthenticationService, ReportsService, FamiliesService } from '../../../servicos/index.service';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { FloatTimePipe } from '../../../shared/pipes/floatTime';
import 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';
declare var jsPDF: any;

@Component({
  selector: 'app-inventario-permanencia',
  templateUrl: './inventario-permanencia.component.html',
  styleUrls: ['./inventario-permanencia.component.css'],
})
export class InventarioPermanenciaComponent implements OnInit {

  public listOfPermanence: any[] = [];
  public auxListOfPermanence: any[] = [];

  public listOfFamilies: any[] = [];
  public selectedFamily: any = null;

  public listOfSerials: any[] = [];
  public selectedSerial: any = null;

  public actualPage: number = -1;

  constructor(public translate: TranslateService,
    private reportService: ReportsService,
    private familyService: FamiliesService,
    private auth: AuthenticationService) {

    if (translate.getBrowserLang() == undefined || this.translate.currentLang == undefined) translate.use('pt');
  }

  ngOnInit() {
    //Loads the table headers
    this.loadTableHeaders();

    //Loading the families
    this.loadPackings();

    //Loads the data in the table
    this.permanenceInventory();
  }

  /**
   * Default list
   */
  permanenceInventory() {
    this.reportService.getPermanenceInventory().subscribe(result => {
      this.listOfPermanence = result;
      this.auxListOfPermanence = result;
    }, err => { console.log(err) });
  }

  /**
   * Loading the families
   */
  loadPackings() {
    this.familyService.getAllFamilies().subscribe(result => {

      this.listOfFamilies = result;
    }, err => console.error(err));
  }

  /**
   * A family was selected
   */
  familyFilter(event: any) {
    console.log(event);

    if (!event) {
      this.listOfPermanence = this.auxListOfPermanence;
      this.selectedFamily = null;

      this.selectedSerial = null;
      this.listOfSerials = [];
      return;
    }

    this.listOfPermanence = this.auxListOfPermanence.filter(elem => {
      return elem.family_code == event.code;
    });

    this.loadSerials(event);
  }

  /**
   * Loads the serials
   */
  loadSerials(event: any) {

    this.selectedSerial = null;

    let aux = this.listOfPermanence.filter(elem => {
      return elem.family_code == event.code;
    });

    // console.log(aux);
    this.listOfSerials = aux;
  }

  /**
   * A serial was selected
   */
  serialFilter(event: any) {

    if (!event) {
      this.selectedSerial = null;
      this.familyFilter(this.selectedFamily);
      return;
    }

    let aux = this.auxListOfPermanence.filter(elem => {
      return ((elem.family_code == event.family_code) && (elem.serial == event.serial));
    });

    //console.log(aux);
    this.listOfPermanence = aux;
  }

  /**
  * 
  * Ordenação da tabela
  */
  public headers: any = [];
  public sortStatus: any = ['asc', 'desc'];
  public sort: any = {
    name: '',
    order: ''
  };

  loadTableHeaders() {
    this.headers.push({ label: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.FAMILY'), name: 'family_code' });
    this.headers.push({ label: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.SERIAL'), name: 'serial' });
    this.headers.push({ label: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TAG'), name: 'tag.code' });

    this.headers.push({ label: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.ACTUAL_SITE'), name: 'current_control_point_name' });
    this.headers.push({ label: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.SITE_TYPE'), name: 'current_control_point_type' });
    this.headers.push({ label: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TIME_AT_SITE'), name: 'permanence_time_exceeded' });
  }

  headerClick(item: any) {
    this.sort.name = item.name;
    this.sort.order = this.sortStatus[(this.sortStatus.indexOf(this.sort.order) + 1) % 2];

    this.listOfPermanence = this.customSort(this.listOfPermanence, item.name.split("."), this.sort.order);
  }

  /**
   * 
   * @param array     All items.
   * @param keyArr    Array with attribute path, if exists.
   * @param reverse   optional. 1 if ascendent, -1 else.
   */
  customSort(array: any[], keyArr: any[], reverse = 'asc') {
    var sortOrder = 1;
    if (reverse == 'desc') sortOrder = -1;

    // console.log('array.length: ' + array.length);
    // console.log('keyArr: ' + keyArr);
    // console.log('sortOrder: ' + sortOrder);

    return array.sort(function (a, b) {
      var x = a, y = b;
      for (var i = 0; i < keyArr.length; i++) {
        x = x[keyArr[i]];
        y = y[keyArr[i]];
      }
      return sortOrder * ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }
  /**
  * ================================================
  * Downlaod csv file
  */

  private csvOptions = {
    showLabels: true,
    fieldSeparator: ';'
  };

  /**
  * Click to download
  */
  downloadCsv() {

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfPermanence.slice());

    //Add a header in the flat json data
    flatObjectData = this.addHeader(flatObjectData);

    //Instantiate a new csv object and initiate the download
    new Angular2Csv(flatObjectData, this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TITLE'), this.csvOptions);
  }

  /**
 * Click to download pdf file
 */
  downloadPdf() {
    var doc = jsPDF('l', 'pt');

    // You can use html:
    //doc.autoTable({ html: '#my-table' });

    //Flat the json object to print
    //I'm using the method slice() just to copy the array as value.
    let flatObjectData = this.flatObject(this.listOfPermanence.slice());
    flatObjectData = flatObjectData.map(elem => {
      return [elem.a1, elem.a2, elem.a3, elem.a4, elem.a5, elem.a6];
    });
    // console.log(flatObjectData);

    // Or JavaScript:
    //head: [['Família', 'Serial', 'Tag', 'Planta Atual', 'Local', 'Tempo na Planta']],
    doc.autoTable({
      head: [[
        this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.FAMILY'),
        this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.SERIAL'),
        this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TAG'),
        this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.ACTUAL_SITE'),
        this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.SITE_TYPE'),
        this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TIME_AT_SITE')
      ]],
      body: flatObjectData
    });

    doc.save('permanence.pdf');
  }

  flatObject(mArray: any) {

    //console.log(mArray);

    let transformer = new FloatTimePipe();
    let plainArray = mArray.map(obj => {
      return {
        a1: obj.family_code,
        a2: obj.serial,
        a3: obj.tag.code,
        a4: obj.current_control_point_name,
        a5: obj.current_control_point_type,
        a6: obj.permanence_time_exceeded !== '-' ? transformer.transform(obj.permanence_time_exceeded) : this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.NO_HISTORY')
      };
    });

    // As my array is already flat, I'm just returning it.
    return plainArray;
  }

  addHeader(mArray: any) {

    let cabecalho = {
      a1: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.FAMILY'),
      a2: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.SERIAL'),
      a3: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TAG'),
      a4: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.ACTUAL_SITE'),
      a5: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.SITE_TYPE'),
      a6: this.translate.instant('INVENTORY.PERMANENCE_TIME_INVENTORY.TIME_AT_SITE')
    }

    //adiciona o cabeçalho
    mArray.unshift(cabecalho);

    return mArray;
  }
}

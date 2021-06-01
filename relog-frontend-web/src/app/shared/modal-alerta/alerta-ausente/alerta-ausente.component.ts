import { Component, OnInit, Input } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Pagination } from '../../models/pagination';
import { InventoryService, InventoryLogisticService, RackService } from '../../../servicos/index.service';
import { LayerModalComponent } from '../../modal-rack/layer.component';
import { constants } from '../../../../environments/constants';

@Component({
  selector: 'app-alerta-ausente',
  templateUrl: './alerta-ausente.component.html',
  styleUrls: ['./alerta-ausente.component.css']
})
export class AlertaAusenteComponent implements OnInit {

  @Input() alerta;

  public mConstants: any;

  constructor(
    public activeAlerta: NgbActiveModal,
    private racksService: RackService,
    private modalService: NgbModal) {

    this.mConstants = constants;
  }

  ngOnInit() {
    //console.log(JSON.stringify(this.alerta));
    //this.getHistoric();
  }

  getHistoric() {
    // this.inventoryService
    //   .getInventoryRackHistoric(
    //     10,
    //     this.historic.meta.page,
    //     this.alerta.data.rack.serial,
    //     this.alerta.data.rack.code,
    // ).subscribe(
    //     result => {
    //       this.historic = result;
    //       this.historic.data = this.historic.data.map(elem => {
    //         elem.status = constants[elem.status];
    //         return elem;
    //       });
    //     },
    //     err => {
    //       console.log(err);
    //     },
    // );
  }

  visualizeOnMap() {

    this.racksService
      .getRack(this.alerta._id)
      .subscribe(
        result => {
          let actualPackage = result;
          //console.log('actualPackage: ' + JSON.stringify(actualPackage[0]));

          this.activeAlerta.dismiss('open map');
          const modalRef = this.modalService.open(LayerModalComponent, {
            backdrop: 'static',
            size: 'lg',
            windowClass: 'modal-xl',
          });
          actualPackage.alertCode = this.alerta.current_state;
          actualPackage.tag = actualPackage.tag.code;
          actualPackage.family_code = this.alerta.family.code;
          
          console.log(this.alerta);
          console.log(actualPackage);
          modalRef.componentInstance.rack = actualPackage;
        },
        err => {
          console.log(err);
        },
      );
  }

  generalInventoryEquipament() { }

}

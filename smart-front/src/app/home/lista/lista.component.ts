import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { EmbalagensService } from '../../servicos/embalagens.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { Router } from '@angular/router';
import { ModalComponent } from '../../shared/modal/modal.component';
import { AlertsService } from '../../servicos/alerts.service';
import { Alert } from '../../shared/models/alert';

@Component({
  selector: 'lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.css']
})
export class ListaComponent implements OnInit {
  // embalagens: any[]
  // embalagem: any;
  // lista: any[]
  alerts: Alert[];
  alert: Alert;
  inscricao: Subscription;

  constructor(
    private AlertsService: AlertsService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal

  ) { }

  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['hashing'];
        this.AlertsService.getAlertsPaginationByHashing(10,1,id)
          .subscribe(alerts => this.alerts = alerts,
          err => {
            console.log(err);
          });
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

  open(embalagem) {
    console.log(embalagem);
    this.AlertsService.retrieveAlertByPacking(embalagem)
      .subscribe(packing => {
        const modalRef = this.modalService.open(ModalComponent);
        modalRef.componentInstance.embalagem = packing;
      },
      err => {
        console.log(err);
      });

  }

}
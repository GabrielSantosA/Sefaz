import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Plant } from '../../../../shared/models/plant';
import { PlantsService } from '../../../../servicos/plants.service';;
import { ToastService } from '../../../../servicos/toast.service';
@Component({
  selector: 'app-planta-cadastrar',
  templateUrl: './planta-cadastrar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlantaCadastrarComponent implements OnInit {

  constructor(
    private PlantsService: PlantsService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private toastService: ToastService
  ) { }

  plant: Plant = new Plant();
  autocomplete: any;
  address: any = {};
  center: any;
  pos : any;

  registerPlant():void {
    this.PlantsService.createPlant(this.plant).subscribe( result => this.toastService.success('/rc/cadastros/planta', 'Planta'), err => this.toastService.error(err) );
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

  onMapReady(map) {
    this.plant.lat = map.center.lat();
    this.plant.lng = map.center.lng();
  }

  onClick(event, str) {
      if (event instanceof MouseEvent){
        return;
      }
      console.log(event);
     this.pos = event.latLng;
    //  this.plant.location =
     this.plant.lat = event.latLng.lat();
     this.plant.lng = event.latLng.lng();
     event.target.panTo(event.latLng);
    }


  ngOnInit() {
  console.log(this.plant);
  }

}

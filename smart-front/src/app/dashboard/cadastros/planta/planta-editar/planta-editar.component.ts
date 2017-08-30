import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Plant } from '../../../../shared/models/plant';
import { PlantsService } from '../../../../servicos/plants.service';
import { GeocodingService } from '../../../../servicos/geocoding.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-planta-editar',
  templateUrl: './planta-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlantaEditarComponent implements OnInit {
  public inscricao: Subscription;
  public plant: FormGroup;
  public autocomplete: any;
  public address: any = {};
  public center: any;
  public pos : any;
  constructor(
    private PlantsService: PlantsService,
    private router: Router,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private fb: FormBuilder,
    private geocodingService: GeocodingService

  ) {
    this.plant = this.fb.group({
      plant_name: ['', [Validators.required]],
      lat: ['', [Validators.required]],
      lng: ['', [Validators.required]],
      location: ['', [Validators.required]],
      profile: [[], [Validators.required]],
      _id:['', [Validators.required]],
      __v: [''],
    });
  }



  onSubmit({ value, valid }: { value: Plant, valid: boolean }): void {
    if(valid)this.PlantsService.updatePlant(value._id,value)
                 .subscribe( result => this.toastService.edit('/rc/cadastros/planta', 'Planta'), err => this.toastService.error(err) );
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

  onClick(event, str) {
      if (event instanceof MouseEvent){
        return;
      }

     this.pos = event.latLng;

     this.plant.controls.lat.setValue(event.latLng.lat());
     this.plant.controls.lng.setValue(event.latLng.lng());
     event.target.panTo(event.latLng);
    }


    ngOnInit() {

      this.inscricao = this.route.params.subscribe(
        (params: any)=>{
          let id = params ['id'];
          this.PlantsService.retrievePlant(id).subscribe(result => {
            (<FormGroup>this.plant)
                    .setValue(result.data, { onlySelf: true });

            this.center = { lat: this.plant.controls.lat.value, lng: this.plant.controls.lng.value };
            this.pos = [this.plant.controls.lat.value,this.plant.controls.lng.value];
          });
        }
      )
    }

    ngOnDestroy () {
      this.inscricao.unsubscribe();
    }

}

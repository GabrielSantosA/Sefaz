import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GC16 } from '../../../shared/models/gc16';
import { ToastService, FamiliesService, GC16Service } from '../../../servicos/index.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import * as $ from 'jquery'


@Component({
  selector: 'app-gc16-adicionar',
  templateUrl: './gc16-adicionar.component.html',
  styleUrls: ['./gc16-adicionar.component.css'],
})

export class Gc16AdicionarComponent implements OnInit {

  @ViewChild('drawer') drawer: ElementRef;

  public listOfFamilies: any;
  public gc16: FormGroup;
  public submitted: boolean = false;

  constructor(
    private gc16Service: GC16Service,
    private familyService: FamiliesService,
    private fb: FormBuilder,
    private toastService: ToastService) {

  }

  ngOnInit() {

    this.configureFormGroup();
    this.loadfamilies();
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {

    this.submitted = true;
    
    if (valid) {
      
      //reduzindo família ao seu id
      value.family = this.gc16['controls'].family.value._id;

      this.gc16Service.createGC16(value).subscribe(result => {
        this.toastService.success('/rc/bpline', 'BPline');
      });
    }
  }

  onBlurMethod() {

    //console.log(this.gc16);

    //general
    let annual_volume = this.gc16.controls.annual_volume.value
    let capacity = this.gc16.controls.capacity.value
    let productive_days = this.gc16.controls.productive_days.value
    let container_days = this.gc16.controls.container_days.value

    //security_factor
    let percentage = this.gc16['controls'].security_factor['controls'].percentage.value

    //frequency
    let f_days = this.gc16.controls.frequency['controls'].days.value

    //transportation_going
    let tg_days = this.gc16.controls.transportation_going['controls'].days.value

    //transportation_back
    let tb_days = this.gc16.controls.transportation_back['controls'].days.value

    //owner_stock
    let os_days = this.gc16.controls.owner_stock['controls'].days.value

    //client_stock
    let cs_days = this.gc16.controls.client_stock['controls'].days.value

    if ((capacity || capacity == 0) && (annual_volume || annual_volume == 0) && (productive_days || productive_days == 0)) {

      this.gc16
        .controls.container_days
        .setValue(Math.floor(((annual_volume / productive_days) / capacity)));

      container_days = this.gc16['controls'].container_days.value
    }

    //setting Initializate
    if ((os_days || os_days == 0) && (cs_days || cs_days == 0) && (tg_days || tg_days == 0) && (tb_days || tb_days == 0) && (f_days || f_days == 0)) {

      this.gc16
        .controls
        .frequency['controls']
        .qty_total_days
        .setValue((os_days + cs_days + tg_days + tb_days) + (2 * f_days));

      let quantTotalDays = this.gc16['controls'].frequency['controls'].qty_total_days.value

      if ((container_days || container_days == 0) && (quantTotalDays || quantTotalDays == 0) && (percentage || percentage == 0)) {

        //security_factor
        this.gc16['controls']
          .security_factor['controls']
          .qty_total_build
          .setValue(Math.ceil(((((1 + (percentage / 100)) * container_days) * quantTotalDays))));

        this.gc16['controls']
          .security_factor['controls']
          .qty_container
          .setValue(Math.ceil(((percentage * this.gc16['controls'].security_factor['controls'].qty_total_build.value) / 100)));

        //frequency
        this.gc16['controls']
          .frequency['controls']
          .fr
          .setValue(Math.floor(((this.gc16['controls'].frequency['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .frequency['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].frequency['controls'].fr.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        //owner_stock
        this.gc16['controls']
          .owner_stock['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].owner_stock['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .owner_stock['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].owner_stock['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        this.gc16['controls']
          .owner_stock['controls']
          .qty_container_max
          .setValue((this.gc16['controls'].owner_stock['controls'].qty_container.value + this.gc16['controls'].frequency['controls'].qty_container.value));

        this.gc16['controls']
          .owner_stock['controls']
          .max
          .setValue((this.gc16['controls'].owner_stock['controls'].value.value + this.gc16['controls'].frequency['controls'].fr.value));

        //client_stock
        this.gc16['controls']
          .client_stock['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].client_stock['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .client_stock['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].client_stock['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        this.gc16['controls']
          .client_stock['controls']
          .qty_container_max
          .setValue((this.gc16['controls'].client_stock['controls'].qty_container.value + this.gc16['controls'].frequency['controls'].qty_container.value));

        this.gc16['controls']
          .client_stock['controls']
          .max
          .setValue((this.gc16['controls'].client_stock['controls'].value.value + this.gc16['controls'].frequency['controls'].fr.value));

        //transportation_going
        this.gc16['controls']
          .transportation_going['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].transportation_going['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .transportation_going['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].transportation_going['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));

        //transportation_back
        this.gc16['controls']
          .transportation_back['controls']
          .value
          .setValue(Math.floor(((this.gc16['controls'].transportation_back['controls'].days.value / quantTotalDays) * 100)));

        this.gc16['controls']
          .transportation_back['controls']
          .qty_container
          .setValue(Math.floor(((this.gc16['controls'].transportation_back['controls'].value.value / 100) * this.gc16['controls'].security_factor['controls'].qty_total_build.value)));
      }
    }

  }

  loadfamilies(): void {

    this.familyService.getAllFamilies().subscribe(result => {
      this.listOfFamilies = result;
    }, err => console.error(err));
  }


  configureFormGroup() {

    this.gc16 = this.fb.group({
      annual_volume: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      productive_days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      capacity: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
      container_days: ['', [Validators.required]],
      family: [undefined, [Validators.required]],
      security_factor: this.fb.group({
        percentage: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        qty_total_build: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      owner_stock: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        max: ['', [Validators.required]],
        qty_container: ['', [Validators.required]],
        qty_container_max: ['', [Validators.required]]
      }),
      client_stock: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        max: ['', [Validators.required]],
        qty_container: ['', [Validators.required]],
        qty_container_max: ['', [Validators.required]]
      }),
      transportation_going: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      transportation_back: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        value: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      }),
      frequency: this.fb.group({
        days: ['', [Validators.required, Validators.pattern(/^(?![0.]+$)\d+(\.\d{1,})?$/)]],
        fr: ['', [Validators.required]],
        qty_total_days: ['', [Validators.required]],
        qty_container: ['', [Validators.required]]
      })
    });
  }

}
import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { NgbModal, NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from "@angular/forms";
import {
  SettingsService,
  AuthenticationService,
  ToastService,
  CEPService,
  ProfileService,
} from "../../servicos/index.service";
import { MeterFormatter } from "../pipes/meter_formatter";
import { WeekFormatter } from "../pipes/week_formatter";
import { ChargeFormatter } from "../pipes/charge_formatter";
import { MeterFormatterInM } from "../pipes/meter_formatter_in_m";

declare var $: any;

@Component({
  selector: "app-modal-user",
  templateUrl: "./modal-settings.component.html",
  styleUrls: ["./modal-settings.component.css"],
})
export class ModalSettings implements OnInit {
  //Form group
  public settings: FormGroup;

  private actualSettings: any;

  //Bateria
  public batteryConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 100,
    },
    tooltips: new ChargeFormatter(),
    step: 1,
  };

  //Acurácia
  public accuracyConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 32,
    },
    tooltips: new MeterFormatter(),
    step: 0.1,
  };

  //Raio da Planta
  public radiusConfig: any = {
    connect: [true, false],
    range: {
      min: 0,
      max: 4000,
    },
    tooltips: new MeterFormatterInM(),
    step: 1,
  };

  //
  public someWeekConfig: any = {
    range: {
      min: 604800000,
      max: 36288000000,
    },
    tooltips: new WeekFormatter(),
    step: 604800000,
  };

  constructor(
    public activeModal: NgbActiveModal,
    private settingsService: SettingsService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.formProfile();
  }

  async formProfile() {
    // this.settings = this.fb.group({
    //   battery_level: ['', [Validators.required]],
    //   range_radius: ['', [Validators.required]],
    //   clean: ['', [Validators.required]],
    //   register_gc16: this.fb.group({
    //     enable: [Boolean],
    //     id: [String],
    //     days: [Number]
    //   }),
    //   _id: ['', [Validators.required]],
    //   __v: ['', [Validators.required]]
    // });

    this.settings = this.fb.group({
      enable_gc16: [false, [Validators.required]],
      battery_level_limit: [0, [Validators.required]],
      accuracy_limit: [0, [Validators.required]],
      job_schedule_time_in_sec: [0, [Validators.required]],
      range_radius: [0, [Validators.required]],
      clean_historic_moviments_time: [0, [Validators.required]],
      no_signal_limit_in_days: [0, [Validators.required]],
      missing_sinal_limit_in_days: [0, [Validators.required]],

      //alerts
      enable_viagem_perdida: [true, [Validators.required]],
      enable_local_incorreto: [true, [Validators.required]],
      enable_viagem_atrasada: [false, [Validators.required]],
      enable_sem_sinal: [false, [Validators.required]],
      enable_perdida: [false, [Validators.required]],

      double_check_incorrect_local: [false, [Validators.required]],
    });

    let result = await this.settingsService.getSettings();

    this.actualSettings = result;
    this.actualSettings.accuracy_limit =
      this.actualSettings.accuracy_limit / 1000;

    this.settings.patchValue(this.actualSettings, { onlySelf: true });
    this.settings.patchValue(this.actualSettings, { onlySelf: true });

    // console.log(this.actualSettings);
    // console.log(this.settings);
  }

  validadeJob(event: any) {
    if (event.target.value < 60)
      this.settings
        .get("job_schedule_time_in_sec")
        .setErrors({ lessThanMinimum: true });
    else this.settings.get("job_schedule_time_in_sec").setErrors(null);
  }

  validadeHistoric(event: any) {
    if (event.target.value < 1)
      this.settings
        .get("clean_historic_moviments_time")
        .setErrors({ lessThanMinimum: true });
    else this.settings.get("clean_historic_moviments_time").setErrors(null);
  }

  validadeNoSignal(event: any) {
    if (event.target.value < 1)
      this.settings
        .get("no_signal_limit_in_days")
        .setErrors({ lessThanMinimum: true });
    else this.settings.get("no_signal_limit_in_days").setErrors(null);
  }

  validadeMissing(event: any) {
    if (event.target.value < 1)
      this.settings
        .get("missing_sinal_limit_in_days")
        .setErrors({ lessThanMinimum: true });
    else this.settings.get("missing_sinal_limit_in_days").setErrors(null);
  }

  onSubmit({ value, valid }: { value: any; valid: boolean }): void {
    //console.log(value);

    if (valid) {
      value.accuracy_limit = value.accuracy_limit * 1000;

      this.settingsService
        .editSetting(value, this.actualSettings._id)
        .subscribe(
          (result) => {
            this.toastService.edit("", "Configurações");
            this.closeModal();
            this.authenticationService.updateCurrentSettings();
          },
          (err) => this.toastService.error(err)
        );
    }
  }

  closeModal() {
    this.activeModal.close();
  }
}

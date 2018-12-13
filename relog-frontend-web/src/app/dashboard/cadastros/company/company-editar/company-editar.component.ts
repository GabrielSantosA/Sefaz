import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder, AbstractControl } from '@angular/forms';
import { CompaniesService } from '../../../../servicos/companies.service';
import { ToastService } from '../../../../servicos/index.service';
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-company-editar',
  templateUrl: './company-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class CompanyEditarComponent implements OnInit {

  public newCompany = this.fb.group({
    name: ['', [Validators.required]],
    phone: '',
    cnpj: '',
    address: this.fb.group({
      street: '',
      city: '',
      cep: '',
      uf: ''
    }),
    type: '' });
  public typesOnSelect: any;
  public companyType: any;
  public activePacking: boolean = false;

  //form
  public mId: string;
  public mCompanyName: string;
  public mPhone: string;
  public mStreet: string;
  public mCep: string;
  public mCity: string;
  public mUf: string;

  //Mask
  public maskTel = ['(', /[0-9]/, /\d/, ')', /\d/, /\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/];
  public maskCep = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
  public maskCNPJ = [/[0-9]/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/];
  //public maskUF = [/[A-Z]/, /[A-Z]/];

  public inscricao: Subscription;
  
  constructor(protected companiesService: CompaniesService,
    protected toastService: ToastService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router) { }

  get street(){
    return this.mStreet;
  }

  ngOnInit() {
    this.formProfile();
    this.fillSelectType();
    this.retrieveUser();
  }

  fillSelectType() {
    this.typesOnSelect = [
      { label: "Owner", name: "owner" },
      { label: "Cliente", name: "client" }];

      //default
      this.companyType = this.typesOnSelect[0];
  }

  retrieveUser(){
    this.inscricao = this.route.params.subscribe((params: any) => {
      this.mId = params['id'];
      this.companiesService.getCompany(this.mId).subscribe(result => {
        
        //console.log('result...' + JSON.stringify(result));

        let actualValues = {
          type: (result.type == this.typesOnSelect[0].name) ? this.typesOnSelect[0] : this.typesOnSelect[1],
          name: result.name,
          phone: result.phone ? result.phone : '',
          cnpj: result.cnpj ? result.cnpj : '',
          address: {
            street: result.address ? result.address.street : '',
            city: result.address ? result.address.city : '',
            cep: result.address ? result.address.cep : '',
            uf: result.address ? result.address.uf : ''
          }
        };
        
        //console.log('this.actualValues...' + JSON.stringify(actualValues));

        (<FormGroup> this.newCompany).patchValue(actualValues, { onlySelf: true });
      });
    });
  }

  formProfile() {
    this.newCompany = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/^((?!\s{2}).)*$/)]],
      phone: ['', [Validators.required]],
      cnpj: ['', []],
      address: this.fb.group({
        city: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^((?!\s{2}).)*$/)]],
        street: ['', [Validators.required, Validators.minLength(4), Validators.pattern(/^((?!\s{2}).)*$/)]],
        cep: ['', [Validators.required]],
        uf: ['', [Validators.required, Validators.minLength(2), Validators.pattern(/^((?!\s{2}).)*$/)]]
      }),
      type: ['', [Validators.required]]
    });
  }

  onSubmit({ value, valid }: { value: any, valid: boolean }): void {
    if (valid) {
      value.type = value.type.name;
      console.log('edit: ' + JSON.stringify(value));

      this.companiesService
        .editCompany(this.mId, value)
        .subscribe(result => { 
          this.router.navigate(['/rc/cadastros/company']); 
          this.toastService.successModal('Empresa', true);
      });
    }
  }

}
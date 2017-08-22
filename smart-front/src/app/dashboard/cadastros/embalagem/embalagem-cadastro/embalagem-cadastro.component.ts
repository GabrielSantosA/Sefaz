import { Component, OnInit } from '@angular/core';
import { PackingService } from '../../../../servicos/packings.service';;
import { Packing } from '../../../../shared/models/packing';
import { TagsService } from '../../../../servicos/tags.service';
import { SuppliersService } from '../../../../servicos/suppliers.service';
import { ProjectService } from '../../../../servicos/projects.service';;
import { Supplier } from '../../../../shared/models/supplier';
import { Router } from '@angular/router';
import { Select2Module } from 'ng2-select2';
import { ToastService } from '../../../../servicos/toast.service';
@Component({
  selector: 'app-embalagem-cadastro',
  templateUrl: './embalagem-cadastro.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class EmbalagemCadastroComponent implements OnInit {

  constructor(
    private TagsService: TagsService,
    private PackingService: PackingService,
    private router: Router,
    private SuppliersService: SuppliersService,
    private ProjectService: ProjectService,
    private toastService: ToastService
  ) { }

  tags =  [];
  projects = [];
  suppliers : Supplier [];
  packing:  Packing = new Packing({problem:false,missing:false,tag:"",supplier:"",project:""});

  registerPacking():void {

    this.packing.code_tag = this.packing.tag.code;
    this.packing.tag = this.packing.tag._id;
    this.packing.hashPacking = this.packing.supplier + this.packing.code;
    this.PackingService.createPacking([this.packing]).subscribe( result => this.toastService.success('/rc/cadastros/embalagem', 'Embalagem'), err => this.toastService.error(err) );
  }

  loadTags():void {
    this.TagsService.retrieveAllNoBinded().subscribe( result => this.tags = result.data, err => {console.log(err)});
  }


  loadSuppliers():void{
    this.SuppliersService.retrieveAll().subscribe(result => this.suppliers = result, err => {console.log(err)});
  }

  loadProject():void{
    this.ProjectService.retrieveAll().subscribe(result => this.projects = result.data, err => {console.log(err)});
  }

   changed(e: any): void {
    this.packing.supplier= e.value;
  }


  ngOnInit() {

    this.loadTags();
    this.loadSuppliers();
    this.loadProject();
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '../../../../shared/models/project';
import { ProjectService } from '../../../../servicos/projects.service';;
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastService } from '../../../../servicos/toast.service';

@Component({
  selector: 'app-plataforma-editar',
  templateUrl: './plataforma-editar.component.html',
  styleUrls: ['../../cadastros.component.css']
})
export class PlataformaEditarComponent implements OnInit {
  public inscricao: Subscription;
  constructor(
    private ProjectService: ProjectService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  project: Project = new Project();


  registerProject():void {
    this.ProjectService.updateProject(this.project._id,this.project).subscribe( result => this.toastService.edit('/rc/cadastros/plataforma', 'Plataforma'), err =>  this.toastService.error(err));
  }


  ngOnInit() {

    this.inscricao = this.route.params.subscribe(
      (params: any)=>{
        let id = params ['id'];
        this.ProjectService.retrieveProject(id).subscribe(result => this.project = result.data);
      }
    )
  }

  ngOnDestroy () {
    this.inscricao.unsubscribe();
  }

}

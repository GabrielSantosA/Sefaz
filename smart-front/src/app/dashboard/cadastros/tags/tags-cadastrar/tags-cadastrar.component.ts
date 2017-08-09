import { Component, OnInit } from '@angular/core';
import { TagsService } from '../../../../servicos/tags.service';;
import { Tag } from '../../../../shared/models/Tag';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags-cadastrar',
  templateUrl: './tags-cadastrar.component.html',
    styleUrls: ['../../cadastros.component.css']
})
export class TagsCadastrarComponent implements OnInit {

  constructor(
    private TagsService: TagsService,
    private router: Router
  ) { }

  tag = new Tag();

  registerTag():void {
    console.log(this.tag);
    this.TagsService.createTag([this.tag]).subscribe( result => this.router.navigate(['/rc/cadastros/tags']) );
  }

  ngOnInit() {
    console.log(this.tag);
  }

}

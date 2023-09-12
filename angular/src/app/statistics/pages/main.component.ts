import { Component, OnDestroy, OnInit } from '@angular/core';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { statistics } from 'src/environments/environment';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  acronym: string;

  constructor( 
    private menuSrvice: MenuService,
    private harvestingSrvice: HarvestingService 
    ){}


  ngOnInit(): void {
    
    this.menuSrvice.activeRepo.pipe(
      switchMap(repo => {
        return this.harvestingSrvice.getHarvestingByAcronym(repo.acronym)
      })
    ).subscribe(data => {
      this.resultHandler(data.attributes.stats_source_id)
      console.log(data.attributes);
      
      console.log(data.attributes.stats_source_id);
      
    });    
  }

  resultHandler( stats_source_id:string ){

    console.log(stats_source_id, 'en dashboard');
    
    window['lrw'] = {
      widget_div_id: 'usage-stats',
      //identifier: ´´,
      //identifier_meta_field: 'eprints.eprintid',
      //identifier_prefix: '',
      //identifier_regex: '',
      event_labels: {
          'view': 'Vistas',
          'download': 'Descargas',
          'outlink': 'Enlaces'
      },
      scope_labels: {
          'L': 'LA Referencia',
          'N': '[[Nombre Nodo Nacional]]',
          'R': '[[Nombre Repositorio]]'
      },
      country: '[[ISO-país]]',
      national_source: '[[SITEID::XXX]]',
      repository_source: stats_source_id,
      preview: false,
    };

    const widget = document.createElement('script');
    widget.src = '/assets/widget.js';

    const container = document.getElementById('my-widget');
    if (container) {
      container.appendChild(widget);
    }
    
  } 
}
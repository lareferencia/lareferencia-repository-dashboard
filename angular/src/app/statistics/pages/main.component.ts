import { Component, OnDestroy, OnInit } from '@angular/core';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from '../../core/services/loadAppConfig.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  
  acronym: string;

  constructor( 
    private menuSrvice: MenuService,
    private harvestingSrvice: HarvestingService,
    private appConfigService: AppConfigService, 
    ){}


  ngOnInit(): void {

    const algo = this.appConfigService.getConfig()
    console.log(algo);
    
    
    this.menuSrvice.activeRepo.pipe(
      switchMap(repo => {
        return this.harvestingSrvice.getHarvestingByAcronym(repo.acronym)
      })
    ).subscribe(data => {
      this.resultHandler(data.attributes.stats_source_id)
    });    
  }

  resultHandler( stats_source_id:string ){

    window['lrhw'] = {
      //identifier: ´´,
      //identifier_meta_field: 'eprints.eprintid',
      //identifier_prefix: '',
      //identifier_regex: '',
      event_labels: {
        view: 'Vistas',
        download: 'Descargas',
        outlink: 'Enlaces'
      },
      scope_labels: {
        L: 'LA Referencia',
        N: '[[Nombre nodo nacional]]',
        R: '[[Nombre repositorio]]'
      },
      country: '[[ISO-país]]',
      national_source: '[[SITEID::XXX]]',
      repository_source: stats_source_id,
      preview: false,
    };

    const widget = document.createElement('script');
    widget.type = 'module'; // Agrega el atributo type="module" aquí
    widget.src = 'https://cdn.jsdelivr.net/gh/lareferencia/lrhw@0.0.1/dist/widget.js';

    const container = document.getElementById('my-widget');
    if (container) {
      container.appendChild(widget);
    }
    
  } 
}
import { Component, OnInit } from '@angular/core';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from '../../core/services/app-config.service';
import { StatisticsModule } from 'src/app/shared/models/app-config.model';

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

    const widgetConfig = this.appConfigService.getStatisticsModuleConfig()
    console.log(widgetConfig);
    
    this.menuSrvice.activeRepo.pipe(
      switchMap(repo => {
        return this.harvestingSrvice.getHarvestingByAcronym(repo.acronym)
      })
    ).subscribe(data => {
      this.resultHandler(data.attributes.stats_source_id, widgetConfig)
    });    
  }

  resultHandler( stats_source_id:string, widgetConfig: StatisticsModule ){

    window['lrhw'] = {
      //identifier: ´´,
      //identifier_meta_field: 'eprints.eprintid',
      //identifier_prefix: '',
      //identifier_regex: '',
      event_labels: {
        view: widgetConfig.event_labels.view,
        download: widgetConfig.event_labels.download,
        outlink: widgetConfig.event_labels.outlink
      },
      scope_labels: {
        L:  widgetConfig.scope_labels.L,
        N: widgetConfig.scope_labels.N,
        R:  widgetConfig.scope_labels.R
      },
      country: widgetConfig.country,
      national_source:  widgetConfig.national_source,
      repository_source: stats_source_id,
      preview: widgetConfig.preview,
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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { MenuService } from 'src/app/core/services/menu.service';
import { switchMap } from 'rxjs/operators';
import { AppConfigService } from '../../core/services/app-config.service';
import { HistoricStats } from 'src/app/shared/models/app-config.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy  {
  acronym: string;

  constructor( 
    private menuSrvice: MenuService,
    private harvestingSrvice: HarvestingService,
    private appConfigService: AppConfigService, 
    ){}

  ngOnInit(): void {

    const widgetConfig = this.appConfigService.getHistoricStatsData()
    
    this.menuSrvice.activeRepo.pipe(
      switchMap(repo => {
        return this.harvestingSrvice.getHarvestingByAcronym(repo.acronym)
      })
    ).subscribe(data => {
      this.resultHandler(data.attributes.stats_source_id, widgetConfig)
    });    
  }

  ngOnDestroy(): void {
    // Realiza la limpieza necesaria al destruir el componente.
    // Por ejemplo, puedes eliminar el script agregado al DOM.
    const widgetScript = document.querySelector('script[type="module"]');
    if (widgetScript) {
      widgetScript.remove();
    }
  }

  resultHandler( stats_source_id:string, widgetConfig: HistoricStats ){

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
    widget.type = 'module';
    widget.src = 'https://cdn.jsdelivr.net/gh/lareferencia/lrhw@0.0.2/dist/chunks/widget.js';

    const container = document.getElementById('my-widget');
    if (container) {
      container.appendChild(widget);
    }
    
  } 
}
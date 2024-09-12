import { Component, OnInit } from '@angular/core';
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
export class MainComponent implements OnInit  {
  public label: string;
  public errorMessage: string;

  constructor( 
    private menuSrvice: MenuService,
    private harvestingSrvice: HarvestingService,
    private appConfigService: AppConfigService, 
    ){}

  ngOnInit(): void {

    const widgetConfig = this.appConfigService.getHistoricStatsData()
    this.menuSrvice.activeRepo.pipe(
      switchMap(repo => {
        this.label = repo.name;
        return this.harvestingSrvice.getHarvestingByAcronym(repo.acronym)
      })
    ).subscribe(data => {            
      this.resultHandler(data.attributes.stats_source_id, widgetConfig, data.institutionName)
    });    
  }

  resultHandler( stats_source_id: string, widgetConfig: HistoricStats, institutionName: string){
    if (!stats_source_id) {
      this.errorMessage = 'No statistics source id found';
      return;
    }
    window['lrhw'] = {
      parameters: {
        widget_div_id: "lrhw-widget",
        default_repository: {
            label: `${institutionName} - ${this.label}`,
            value: stats_source_id,
          },
        scope_labels: {
          N: institutionName,
        },
      }
    }

    const widget = document.createElement('script');
    widget.src = widgetConfig.widget_url;

    const container = document.getElementById('lrhw-widget');
    if (container) {
      container.appendChild(widget);
    }
    
  } 
}
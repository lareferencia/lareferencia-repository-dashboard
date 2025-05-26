import { Component, OnInit, OnDestroy } from '@angular/core';
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
export class MainComponent implements OnInit, OnDestroy {
  public label: string;
  public errorMessage: string;
  private widgetId = 'lrhw-widget';
  private scriptLoaded = false;

  constructor(
    private menuService: MenuService,
    private harvestingService: HarvestingService,
    private appConfigService: AppConfigService,
  ) {}

  ngOnInit(): void {
    const widgetConfig = this.appConfigService.getHistoricStatsData();
    
    this.menuService.activeRepo.pipe(
      switchMap(repo => {
        this.label = repo.name;
        return this.harvestingService.getHarvestingByAcronym(repo.acronym);
      })
    ).subscribe(data => {
      this.resultHandler(data.attributes.stats_source_id, widgetConfig, data.institutionName);
    });
  }

  ngOnDestroy(): void {
    this.removeWidget();
  }

  private resultHandler(stats_source_id: string, widgetConfig: HistoricStats, institutionName: string): void {
    if (!stats_source_id) {
      this.errorMessage = 'No statistics source id found';
      return;
    }

    window['lrhw'] = {
      parameters: {
        widget_div_id: this.widgetId,
        default_repository: {
          label: `${institutionName} - ${this.label}`,
          value: stats_source_id,
        },
        scope_labels: {
          N: widgetConfig.is_national_aggregator ? widgetConfig.scope_labels.N : institutionName,
          R: widgetConfig.is_national_aggregator ? institutionName : ''
        },
      }
    };

    if (!this.scriptLoaded) {
      this.reloadWidget(widgetConfig.widget_url);
    }
  }

  private reloadWidget(widgetUrl: string): void {
    this.removeWidget();

    const div = document.createElement('div');
    div.id = this.widgetId;

    const container = document.getElementById('widget-container');
    if (container) {
      container.appendChild(div);

      const script = document.createElement('script');
      script.src = widgetUrl;
      
      script.onload = () => {
        this.scriptLoaded = true;
      };
      script.onerror = () => {
      };
      container.appendChild(script);
    }
  }

  private removeWidget(): void {
    const container = document.getElementById('widget-container');
    if (container) {
      const existingDiv = document.getElementById(this.widgetId);
      if (existingDiv) {
        existingDiv.remove();
      }

      const existingScript = Array.from(container.getElementsByTagName('script')).find(script => 
        script.src.includes(this.widgetId)
      );
      if (existingScript) {
        existingScript.remove();
      }
      
      this.scriptLoaded = false; 
    }
  }
}

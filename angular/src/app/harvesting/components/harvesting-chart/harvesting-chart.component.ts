import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { HarvestingService } from 'src/app/core/services/harvesting.service';

import { ChartData } from '../../interfaces/stack-chart.interface';

@Component({
  selector: 'app-harvesting-chart',
  templateUrl: './harvesting-chart.component.html',
  styleUrls: ['./harvesting-chart.component.css'],
})
export class HarvestingChartComponent implements OnInit {

  public loadingChart: boolean = true;
  public data: ChartData;
  public options:any;
  public pageNumber = 0;
  public pageSize = 30;
  public startDate: Date = new Date();
  public endDate: Date = new Date();

  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.startDate.setFullYear(this.endDate.getFullYear() - 2);
    this.filtrar();
  }

  filtrar(){
    this.loadingChart = true;

    const acronym = this.route.snapshot.paramMap.get('acronym');
    this.harvestingService.getHarvestingHistoryByAcronymAndDate(acronym, this.pageNumber, this.pageSize, this.startDate, this.endDate)
      .subscribe(({content}) => {

        const sortedConent = content.sort((a, b) => {
          const dateA = new Date(a.startTime).getTime();
          const dateB = new Date(b.startTime).getTime();
          return dateA - dateB;
        });


        this.data = {
        labels: sortedConent.map(harvesting => harvesting.startTime.toString().substring(0,10)),
        datasets: [
            { type: 'bar', label: 'Invalidos', backgroundColor: '#D14D72',
              data: sortedConent.map(harvesting => (harvesting.harvestedSize - harvesting.validSize) ) },

            { type: 'bar', label: 'Validos', backgroundColor: '#FFABAB',
              data: sortedConent.map(harvesting => harvesting.validSize)},
            ]
          };
          this.loadingChart = false;
        });
        this.options = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            tooltips: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: '#44486D',
                    font: {
                        size: 14,
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: '#676B89'
                },
                grid: {
                    color: '#ffff',
                    drawBorder: false
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: '#44486D'
                },
                grid: {
                    color: '#fff',
                    drawBorder: false
                }
            }
        }
      };
  }
}
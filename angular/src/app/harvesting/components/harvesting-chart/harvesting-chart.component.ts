import { Component, OnInit } from '@angular/core';

import { HarvestingService } from 'src/app/core/services/harvesting.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-harvesting-chart',
  templateUrl: './harvesting-chart.component.html',
  styleUrls: ['./harvesting-chart.component.css'],
})
export class HarvestingChartComponent implements OnInit {
  loadingChart: boolean = true;
  data:any;
  options:any;
  pageNumber = 0;
  pageSize = 30;


  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    const acronym = this.route.snapshot.paramMap.get('acronym');

    this.harvestingService.getHarvestingHistoryByAcronym(acronym, this.pageNumber, this.pageSize)
      .subscribe(({content}) => {
        this.data = {
        labels: content.map(harvesting => harvesting.startTime.toString().substring(0,10)).reverse(),
        datasets: [
            { type: 'bar', label: 'Invalidos', backgroundColor: '#D14D72',
              data: content.map(harvesting => (harvesting.harvestedSize - harvesting.validSize) ).reverse() },

            { type: 'bar', label: 'Validos', backgroundColor: '#FFABAB',
              data: content.map(harvesting => harvesting.validSize).reverse()},
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
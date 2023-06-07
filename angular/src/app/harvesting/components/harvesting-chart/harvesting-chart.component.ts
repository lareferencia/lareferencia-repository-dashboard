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
  public data: any;
  public options:any;
  public pageNumber = 0;
  public pageSize = 8;
  public totalElements: number;
  public startDate: Date = new Date();
  public endDate: Date = new Date();
  disabledPagination = false;

  constructor(
    private harvestingService: HarvestingService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.startDate.setFullYear(this.endDate.getFullYear() - 2);
    this.filtrar();
  }

  paginate(page: string){
    if(page === "next" && this.pageNumber < (this.totalElements / this.pageSize) - 1 ){
      this.pageNumber += 1;
    } else if(page === "prev" && this.pageNumber > 0){
      this.pageNumber -= 1;
    }
    this.filtrar();
  }

  clearFilter(){
    this.pageNumber = 0;
    this.filtrar();
  }

  filtrar(){
    this.loadingChart = true;

    const acronym = this.route.snapshot.paramMap.get('acronym');
    this.harvestingService.getHarvestingHistoryByAcronymAndDate(acronym, this.pageNumber, this.pageSize, this.startDate, this.endDate)
      .subscribe((content) => {
        this.totalElements = content.totalElements
        this.pageNumber > (this.totalElements / this.pageSize ) - 1 
        ? this.disabledPagination = true
        : this.disabledPagination = false;
        
        const sortedConent = content.content.sort((a, b) => {
          const dateA = new Date(a.startTime).getTime();
          const dateB = new Date(b.startTime).getTime();
          return dateA - dateB;
        });

        this.data = {
        labels: sortedConent.map(harvesting => harvesting.startTime.toString().substring(0,10)),
        datasets: [
            { type: 'bar', label: 'Invalid', backgroundColor: 'rgba(252, 97, 97, 0.6)',
              data: sortedConent.map(harvesting => (harvesting.harvestedSize - harvesting.validSize) ) },

            { type: 'bar', label: 'Valid', backgroundColor: 'rgba(0, 208, 222, 0.6)',
              data: sortedConent.map(harvesting => harvesting.validSize)},
              {
                type: 'line',
                label: 'Transformed',
                borderColor: 'rgba(0, 160, 171, 0.6)',
                borderWidth: 2,
                fill: false,
                data: sortedConent.map(harvesting => harvesting.transformedSize)
            },
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
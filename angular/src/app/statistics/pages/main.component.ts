import { Component, OnInit } from '@angular/core';
import { statistics } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  
  repository_source = statistics.source;


  ngOnInit(): void {

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
      repository_source: statistics.source
    };

    const widget = document.createElement('script');
    widget.src = '/assets/widget.js';
    
    const container = document.getElementById('my-widget');
    if (container) {
      container.appendChild(widget);
    }
  }
}
import { Component, OnInit } from '@angular/core';
import { statistics } from 'src/environments/environment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
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
      repository_source: statistics.source,
      preview: false,
    };

    const widget = document.createElement('script');
    widget.src = '/assets/index-db7f8927.js';

    widget.onload = () => {
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = '/assets/index-5f18fb7c.css';
      document.head.appendChild(cssLink);
  };
  
    
    const container = document.getElementById('my-widget');
    if (container) {
      container.appendChild(widget);
    }
  }
}
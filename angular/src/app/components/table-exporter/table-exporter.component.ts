import { Component, OnInit, Input } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-table-exporter',
  templateUrl: './table-exporter.component.html',
  styleUrls: ['./table-exporter.component.css'],
})
export class TableExporterComponent implements OnInit {
  @Input() data: any[];
  constructor() {}

  ngOnInit(): void {}

  export(): void {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalSeparator: 'locale',
      showLabels: false,
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      filename: 'report',
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.data);
  }
}

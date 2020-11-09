import { Component, OnInit, Input } from '@angular/core';
import { ExportToCsv } from 'export-to-csv';

@Component({
  selector: 'app-table-exporter',
  templateUrl: './table-exporter.component.html',
  styleUrls: ['./table-exporter.component.css'],
})
export class TableExporterComponent implements OnInit {
  @Input() data: any[];
  @Input() header: any[];
  constructor() {}

  ngOnInit(): void {}

  export(): void {
    const options = {
      fieldSeparator: ';',
      quoteStrings: '"',
      decimalSeparator: 'locale',
      showLabels: true,
      showTitle: false,
      title: '',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: false,
      filename: 'report',
      headers: this.header
    };

    const csvExporter = new ExportToCsv(options);
    csvExporter.generateCsv(this.data);
  }
}

import { ProcessInfo } from '../../../shared/models/process-info.model';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-process-list',
  templateUrl: './process-list.component.html',
  styleUrls: ['./process-list.component.css'],
})
export class ProcessListComponent {
  @Input() processes: ProcessInfo[] = [];

  onUpdateStatus(processStatus: ProcessInfo) {
    this.processes.map(
      (x) =>
        (x.status =
          x.description === processStatus.description
            ? processStatus.status
            : x.status)
    );
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Network } from 'src/app/shared/models/harvesting-admin.model';
import { SharedModule } from "../../../../../../shared/shared.module";
import { PrimengMaterial } from 'src/app/primeng-material/primeng-material.module';

@Component({
  selector: 'app-networks-dashboard',
  standalone: true,
  imports: [CommonModule, SharedModule, PrimengMaterial],
  templateUrl: './networks-dashboard.component.html',
  styleUrls: ['./networks-dashboard.component.css']
})


export class NetworksDashboardComponent implements OnInit {

@Input() network: Network;

// <td >Cosecha fallida	</td>
//           <td >2025-03-17 10:12:01	</td>
//           <td >2025-03-17 11:39:56	</td>
//           <td>298310</td>
//           <td>298310</td>
//           <td>0</td>
//           <td>0</td>
//           <td>No</td>
lastHarvests = [
  { id: 1, status: 'Cosecha fallida', start: '2025-03-17 10:12:01', end: '2025-03-17 11:39:56', total: 298310, harvested: 298310, failed: 0, pending: 0, retry: 'No' },
]
ngOnInit() {
  console.log(this.network); 
 }
}

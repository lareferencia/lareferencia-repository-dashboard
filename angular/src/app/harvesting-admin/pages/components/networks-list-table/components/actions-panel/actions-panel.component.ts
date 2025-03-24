import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'Actions-panel',
  templateUrl: './actions-panel.component.html',
  styleUrls: ['./actions-panel.component.css']
})
export class ActionsPanelComponent implements OnInit {

  constructor() { }

  public actions: any  = [];
  ngOnInit(): void {

    this.actions = [
      {
          workers: ["harvestingWorker"],
          incremental: true,
          properties: [
              { name: "FORCE_FULL_HARVESTING", description: "Force full harvesting?" }
          ],
          runOnSchedule: true,
          allwaysRunOnSchedule: true,
          name: "HARVESTING_ACTION",
          description: "Harvesting"
      },
      {
          workers: ["validationWorker"],
          incremental: true,
          properties: [
              { name: "DETAILED_DIAGNOSE", description: "Perform detailed diagnostics (occurrences)" }
          ],
          runOnSchedule: true,
          allwaysRunOnSchedule: true,
          name: "VALIDATION_ACTION",
          description: "Validation/Transf"
      },
      {
          workers: ["frontendIndexerWorker"],
          incremental: true,
          properties: [
              { name: "INDEX_FRONTEND", description: "Index on frontend?" },
              { name: "INDEX_FULLTEXT", description: "Index full text?" }
          ],
          runOnSchedule: true,
          allwaysRunOnSchedule: false,
          name: "FRONTEND_INDEXING_ACTION",
          description: "Index Frontend"
      },
      {
          workers: ["frontendDeleteWorker"],
          incremental: false,
          properties: [],
          runOnSchedule: false,
          allwaysRunOnSchedule: false,
          name: "FRONTEND_DELETE_ACTION",
          description: "UnIndex Frontend"
      },
      {
          workers: ["xoaiIndexerWorker"],
          incremental: true,
          properties: [
              { name: "INDEX_XOAI", description: "Export to OAI-PMH Provider?" }
          ],
          runOnSchedule: true,
          allwaysRunOnSchedule: false,
          name: "XOAI_INDEXING_ACTION",
          description: "Index OAI-PMH"
      },
      {
          workers: ["xoaiDeleteWorker"],
          incremental: false,
          properties: [],
          runOnSchedule: false,
          allwaysRunOnSchedule: false,
          name: "XOAI_DELETE_ACTION",
          description: "UnIndex OAI-PMH"
      },
      {
          workers: ["networkCleanWorker"],
          incremental: false,
          properties: [
              { name: "CLEAN_NETWORK", description: "Clean old snapshots?" }
          ],
          runOnSchedule: true,
          allwaysRunOnSchedule: false,
          name: "NETWORK_CLEAN_ACTION",
          description: "Clean snapshots"
      },
      {
          workers: ["networkDeleteWorker"],
          incremental: false,
          properties: [],
          runOnSchedule: false,
          allwaysRunOnSchedule: false,
          name: "NETWORK_DELETE_ACTION",
          description: "Clean network (!)"
      }
  ];
  
  }

}

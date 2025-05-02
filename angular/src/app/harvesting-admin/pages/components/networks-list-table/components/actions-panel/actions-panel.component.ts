import { Component, Input, OnInit } from '@angular/core';
import { OverlayPanel } from 'primeng/overlaypanel';
import { ConfirmationService, MessageService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'Actions-panel',
  templateUrl: './actions-panel.component.html',
  styleUrls: ['./actions-panel.component.css'],
  providers: [ConfirmationService, MessageService]
})
export class ActionsPanelComponent implements OnInit {

  @Input() actions: any[] = [];

  actionPropsConfig: any = null;
  selectedActions: any = [];


  constructor(private confirmationService: ConfirmationService, private messageService: MessageService) { }
  ngOnInit(): void { }


  confirm1() {
    console.log('confirm1');
    this.confirmationService.confirm({
      message: 'Are you sure that you want to proceed?',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected' });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }


  isSelected(action: any) {
    return this.selectedActions.includes(action);
  }
  toggleAction(action: any) {
    if (this.isSelected(action)) {
      this.selectedActions = this.selectedActions.filter((a: any) => a !== action);
    } else {
      this.selectedActions.push(action);
    }
    console.log(this.selectedActions);

  }

  openConfig(event: Event, action: any, config: OverlayPanel) {
    this.actionPropsConfig = { ...action };
    config.toggle(event);

    console.log(this.actionPropsConfig);

  }
}

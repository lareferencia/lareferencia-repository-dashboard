import { Broker } from 'src/app/shared/models/broker.model';

export interface BrokerEvents {
  content: Broker[];
  totalElements: number;
}

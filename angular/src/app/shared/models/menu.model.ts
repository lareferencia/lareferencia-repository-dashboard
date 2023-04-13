export interface Menu {
  id: number;
  name: string;
  acronym: string;
  // hasBroker: boolean;
}


interface MenuItem {
  label: string;
  routerLink: string[];
  command: () => void;
}

export interface MenuRepositorie {
  label: string;
  items: MenuItem[];

}
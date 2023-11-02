export interface Menu {
  id: number;
  name: string;
  acronym: string;
  // hasBroker: boolean;
}

export interface MenuItem {
  label: string;
  routerLink?: string[];
  command?: () => void;
  escape?: boolean;
}

export interface MenuRepositorie {
  label: string;
  items: MenuItem[];
}


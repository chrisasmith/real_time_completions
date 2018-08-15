export interface MenuItem {
  title: string;
  icon?: MenuItemIcon;
  color?: string;
  active?: boolean;
  disabled?: boolean;
  groupTitle?: boolean;
  routing?: string;
  externalLink?: string;
  sub?: MenuItemSub[];
  isWorkflow?: boolean;
}

export interface MenuItemIcon {
  class?: string;
  color?: string;
  bg?: string;
}

export interface MenuItemSub {
  title: string;
  icon?: string;
  color?: string;
  active?: boolean;
  disabled?: boolean;
  routing?: string;
  externalLink?: string;
  sub?: MenuItemSub[];
}

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SidebarItem {
  id: string;
  path: string;
  label: string;
  icon?: string;
  children?: SidebarItem[];
  isActive?: boolean;
  isExpanded?: boolean;
}

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
  disabled?: boolean;
}
export interface LoginDataUsername {
  username: string;
  password: string;
}

export interface LoginDataEmail {
  email: string;
  password: string;
}

export interface MenuLink {
  text: string;
  href: string;
  external?: boolean;
  category?: string; // New field for filtering
}

export interface MenuSection {
  title: string;
  links: MenuLink[];
}

export interface MenuItem {
  id: string;
  title: string;
  href: string;
  sections?: MenuSection[];
}

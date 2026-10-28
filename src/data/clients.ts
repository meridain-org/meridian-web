export type ClientLogo = {
  id: string;
  logo_url: string;
  created_at?: string;
};

export const defaultClientLogos: ClientLogo[] = [
  {
    id: "client-1",
    logo_url: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "client-2",
    logo_url: "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "client-3",
    logo_url: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "client-4",
    logo_url: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "client-5",
    logo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=320&auto=format&fit=crop&q=80",
  },
  {
    id: "client-6",
    logo_url: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=320&auto=format&fit=crop&q=80",
  },
];

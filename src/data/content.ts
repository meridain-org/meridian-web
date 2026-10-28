export type Service = { slug: string; title: string; short: string; image: string; description: string; benefits: string[]; process: string[]; industries: string[] };
export type Industry = { slug: string; title: string; image: string; intro: string; challenges: string[]; solutions: string[]; services: string[] };

export const imageUrl = (id: string, width = 1400) => {
  if (!id) return "";
  return id.startsWith("https://") ? id : `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`;
};

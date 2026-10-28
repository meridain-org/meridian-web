export interface StoreSettings {
  email: string;
  phone_1: string;
  phone_2: string;
  whatsapp: string;
  instagram: string;
  linkedin: string;
  x: string;
  facebook: string;
}

export const defaultStoreSettings: StoreSettings = {
  email: "info@meridianlogistics.sa",
  phone_1: "+966 11 000 0000",
  phone_2: "+966 50 000 0000",
  whatsapp: "+966500000000",
  instagram: "https://instagram.com",
  linkedin: "https://linkedin.com",
  x: "https://x.com",
  facebook: "",
};

export function formatWhatsAppUrl(whatsapp: string): string {
  if (!whatsapp) return "";
  const trimmed = whatsapp.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const digitsOnly = trimmed.replace(/[^0-9]/g, "");
  return digitsOnly ? `https://wa.me/${digitsOnly}` : "";
}

export function hasSocialLinks(settings?: StoreSettings | null): boolean {
  if (!settings) return false;
  return Boolean(
    settings.whatsapp?.trim() ||
    settings.instagram?.trim() ||
    settings.linkedin?.trim() ||
    settings.x?.trim() ||
    settings.facebook?.trim()
  );
}

export function hasContactInfo(settings?: StoreSettings | null): boolean {
  if (!settings) return false;
  return Boolean(
    settings.email?.trim() ||
    settings.phone_1?.trim() ||
    settings.phone_2?.trim()
  );
}

export function hasTopBarContent(settings?: StoreSettings | null): boolean {
  if (!settings) return false;
  return Boolean(
    settings.phone_1?.trim() ||
    settings.phone_2?.trim() ||
    hasSocialLinks(settings)
  );
}

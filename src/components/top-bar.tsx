import { Phone } from "lucide-react";
import {
  formatWhatsAppUrl,
  hasTopBarContent,
  type StoreSettings,
} from "@/data/settings";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  WhatsAppIcon,
  XIcon,
} from "@/components/social-icons";

export function TopBar({ settings }: { settings?: StoreSettings | null }) {
  if (!settings || !hasTopBarContent(settings)) return null;

  const waUrl = formatWhatsAppUrl(settings.whatsapp || "");

  return (
    <div className="site-topbar" role="region" aria-label="Contact and Social Bar">
      <div className="topbar-shell">
        {/* Left: Phone numbers only */}
        <div className="topbar-left">
          {settings.phone_1?.trim() && (
            <a
              href={`tel:${settings.phone_1.replace(/\s+/g, "")}`}
              className="topbar-link"
              title="Call primary phone"
            >
              <Phone size={12} className="text-orange" />
              <span>{settings.phone_1.trim()}</span>
            </a>
          )}
          {settings.phone_2?.trim() && (
            <a
              href={`tel:${settings.phone_2.replace(/\s+/g, "")}`}
              className="topbar-link hidden sm:inline-flex"
              title="Call secondary phone"
            >
              <Phone size={12} className="text-orange" />
              <span>{settings.phone_2.trim()}</span>
            </a>
          )}
        </div>

        {/* Right: Social Icons (only rendered if non-empty) */}
        <div className="topbar-right">
          <div className="topbar-socials" aria-label="Social media channels">
            {waUrl && (
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat on WhatsApp"
                title="WhatsApp"
                className="topbar-social-btn hover:text-[#25D366]"
              >
                <WhatsAppIcon size={14} />
              </a>
            )}
            {settings.instagram?.trim() && (
              <a
                href={settings.instagram.trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Instagram"
                title="Instagram"
                className="topbar-social-btn hover:text-[#E4405F]"
              >
                <InstagramIcon size={14} />
              </a>
            )}
            {settings.linkedin?.trim() && (
              <a
                href={settings.linkedin.trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect on LinkedIn"
                title="LinkedIn"
                className="topbar-social-btn hover:text-[#0A66C2]"
              >
                <LinkedInIcon size={14} />
              </a>
            )}
            {settings.x?.trim() && (
              <a
                href={settings.x.trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on X"
                title="X (Twitter)"
                className="topbar-social-btn hover:text-white"
              >
                <XIcon size={13} />
              </a>
            )}
            {settings.facebook?.trim() && (
              <a
                href={settings.facebook.trim()}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow on Facebook"
                title="Facebook"
                className="topbar-social-btn hover:text-[#1877F2]"
              >
                <FacebookIcon size={14} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function SocialLinksRow({
  settings,
  className = "",
  iconSize = 16,
}: {
  settings?: StoreSettings | null;
  className?: string;
  iconSize?: number;
}) {
  if (!settings) return null;
  const waUrl = formatWhatsAppUrl(settings.whatsapp || "");

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="Social media">
      {waUrl && (
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          title="WhatsApp"
          className="text-slate-300 hover:text-[#25D366] transition-colors"
        >
          <WhatsAppIcon size={iconSize} />
        </a>
      )}
      {settings.instagram?.trim() && (
        <a
          href={settings.instagram.trim()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
          title="Instagram"
          className="text-slate-300 hover:text-[#E4405F] transition-colors"
        >
          <InstagramIcon size={iconSize} />
        </a>
      )}
      {settings.linkedin?.trim() && (
        <a
          href={settings.linkedin.trim()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
          title="LinkedIn"
          className="text-slate-300 hover:text-[#0A66C2] transition-colors"
        >
          <LinkedInIcon size={iconSize} />
        </a>
      )}
      {settings.x?.trim() && (
        <a
          href={settings.x.trim()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X"
          title="X (Twitter)"
          className="text-slate-300 hover:text-white transition-colors"
        >
          <XIcon size={iconSize - 1} />
        </a>
      )}
      {settings.facebook?.trim() && (
        <a
          href={settings.facebook.trim()}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
          title="Facebook"
          className="text-slate-300 hover:text-[#1877F2] transition-colors"
        >
          <FacebookIcon size={iconSize} />
        </a>
      )}
    </div>
  );
}

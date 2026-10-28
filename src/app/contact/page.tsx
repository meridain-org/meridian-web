import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms";
import { getSiteMediaImage, getStoreSettings } from "@/lib/server/content";
export const dynamic = "force-dynamic";
import { Eyebrow, PageHero, Reveal } from "@/components/site";

export const metadata = {
  title: "Contact",
  description:
    "Contact Meridian Logistics about freight forwarding and logistics requirements.",
  alternates: { canonical: "/contact" },
};

const OFFICE_ADDRESS =
  "Suite 404, 04th Floor, Al Sulaimaniyah Tower, King Saud Street, Al Amamrah District, Dammam 32415, Kingdom of Saudi Arabia";

export default async function ContactPage() {
  const [heroImage, store] = await Promise.all([
    getSiteMediaImage("page.contact.hero"),
    getStoreSettings(),
  ]);

  const phone = store.phone_1.trim();
  const email = store.email.trim();

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s start a conversation."
        description="Tell us what you are moving, where it needs to go, and how we can help."
        image={heroImage}
        compact
      />
      <section className="section-pad">
        <div className="container contact-layout">
          <Reveal className="contact-intro">
            <Eyebrow>Talk to Meridian</Eyebrow>
            <h2>We’re ready to hear about your requirements.</h2>
            <p>
              Use the form to share your enquiry. We’ll follow up using the
              contact details you provide.
            </p>

            <div className="contact-detail-list">
              <div>
                <MapPin />
                <span>
                  <b>Location</b>
                  <small>{OFFICE_ADDRESS}</small>
                </span>
              </div>
              {phone && (
                <div>
                  <Phone />
                  <span>
                    <b>Phone</b>
                    <small>
                      <a href={`tel:${phone.replace(/[^\d+]/g, "")}`}>
                        {phone}
                      </a>
                    </small>
                  </span>
                </div>
              )}
              {email && (
                <div>
                  <Mail />
                  <span>
                    <b>Email</b>
                    <small>
                      <a href={`mailto:${email}`}>{email}</a>
                    </small>
                  </span>
                </div>
              )}
            </div>
          </Reveal>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}

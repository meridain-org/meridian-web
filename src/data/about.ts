export interface AboutSettings {
  // Dedicated About Page Hero
  heroEyebrow: string;
  heroTitle: string;
  heroDescription: string;
  heroImage: string;

  // Company Story Section
  storyEyebrow: string;
  storyTitle: string;
  storyParagraph1: string;
  storyParagraph2: string;
  storyImage: string;
  storyBadgeNumber: string;
  storyBadgeLabel: string;

  // Key Company Performance Metrics / Stats
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;

  // Mission, Vision & Values
  missionTitle: string;
  missionDescription: string;
  visionTitle: string;
  visionDescription: string;
  valuesTitle: string;
  valuesDescription: string;

  // Strategic Capabilities / Strengths
  strengths: string[];

  // Bottom CTA
  ctaTitle: string;
  ctaDescription: string;
  ctaBtnText: string;
  ctaBtnHref: string;
}

export const defaultAboutSettings: AboutSettings = {
  heroEyebrow: "About Meridian Logistics",
  heroTitle: "Precision Logistics That Moves Global Trade Forward",
  heroDescription:
    "Headquartered in Saudi Arabia, Meridian connects industrial and commercial enterprises with seamless multi-modal freight forwarding, warehousing, and project cargo expertise across international trade corridors.",
  heroImage: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=85",

  storyEyebrow: "Our Company Story",
  storyTitle: "Purposeful Connections Built Across Every Shipment",
  storyParagraph1:
    "Meridian Logistics was founded to address the growing demand for agile, compliant, and transparent supply chain operations connecting the Kingdom of Saudi Arabia with major international trade gateways across Asia, Europe, and the Americas.",
  storyParagraph2:
    "From specialized project logistics and oversized heavy-lift consignments to temperature-sensitive pharmaceutical freight and rapid customs brokerage, our experienced team ensures operational excellence with end-to-end tracking and clear communication at every milestone.",
  storyImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85",
  storyBadgeNumber: "20+",
  storyBadgeLabel: "Years of Logistics Excellence",

  stat1Value: "20+",
  stat1Label: "Years of Industry Expertise",
  stat2Value: "45+",
  stat2Label: "Global Trade Corridors",
  stat3Value: "120K+",
  stat3Label: "TEUs Handled Annually",
  stat4Value: "99.4%",
  stat4Label: "On-Time Fulfillment Rate",

  missionTitle: "Our Mission",
  missionDescription:
    "To deliver reliable, tech-driven, and client-centric supply chain solutions that empower businesses to scale across domestic and international markets with complete peace of mind.",

  visionTitle: "Our Vision",
  visionDescription:
    "To become the premier multi-modal logistics gateway in the Middle East, setting benchmark standards for operational precision, sustainability, and customer trust.",

  valuesTitle: "Our Core Values",
  valuesDescription:
    "Integrity, relentless precision, proactive communication, and an uncompromising commitment to cargo safety and regulatory compliance.",

  strengths: [
    "Multi-Modal Freight Coordination",
    "Licensed Saudi Customs Brokerage",
    "Temperature-Controlled Cold Chain",
    "Heavy-Lift & Project Logistics",
    "Strategic Bonded Warehousing",
    "Real-Time Milestone Visibility",
  ],

  ctaTitle: "Ready to Optimize Your Global Supply Chain?",
  ctaDescription:
    "Connect with our logistics specialists today to discuss customized freight forwarding, route feasibility, and competitive quotation structures.",
  ctaBtnText: "Request a Quote",
  ctaBtnHref: "/request-a-quote",
};

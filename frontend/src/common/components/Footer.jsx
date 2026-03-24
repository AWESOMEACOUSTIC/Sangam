import React from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    href: "#",
    icon: Instagram,
  },
  {
    name: "X",
    href: "#",
    icon: XIcon,
  },
  {
    name: "YouTube",
    href: "#",
    icon: Youtube,
  },
  {
    name: "Facebook",
    href: "#",
    icon: Facebook,
  },
];

const primaryLinks = [
  { label: "Help", href: "#" },
  { label: "Site Index", href: "#" },
  { label: "SangamPro", href: "#" },
  { label: "Box Office Mojo", href: "#" },
  { label: "License Sangam Data", href: "#" },
];

const secondaryLinks = [
  { label: "Press Room", href: "#" },
  { label: "Advertising", href: "#" },
  { label: "Jobs", href: "#" },
  { label: "Conditions of Use", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

function FooterCard({ children, className = "" }) {
  return (
    <div
      className={[
        "rounded-md border border-white/20 bg-transparent",
        "transition-colors duration-200 hover:border-white/30",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function SocialCard() {
  return (
    <FooterCard
      className={[
        "w-full max-w-[430px]",
        "px-5 py-4 sm:px-6",
        "md:min-h-[82px] md:w-[316px]",
      ].join(" ")}
    >
      <h3 className="text-center text-[14px] font-semibold leading-none text-white">
        Follow Sangam on Social
      </h3>

      <ul className="mt-4 flex items-center justify-center gap-5 sm:gap-6">
        {socialLinks.map(({ name, href, icon: Icon }) => (
          <li key={name}>
            <a
              href={href}
              aria-label={name}
              className={[
                "inline-flex h-5 w-5 items-center justify-center",
                "text-white transition-opacity duration-200",
                "hover:opacity-75 focus:outline-none",
                "focus:ring-2 focus:ring-white/50 focus:ring-offset-2",
                "focus:ring-offset-black",
              ].join(" ")}
            >
              <Icon className="h-4 w-4" />
            </a>
          </li>
        ))}
      </ul>
    </FooterCard>
  );
}

function AppCard() {
  return (
    <FooterCard
      className={[
        "w-full max-w-107.5",
        "px-5 py-4 sm:px-6",
        "md:min-h-20.5 md:w-79",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-[14px] font-semibold leading-none text-white">
            Get the Sangam app
          </h3>
          <p className="mt-3 text-[12px] leading-none text-white/70">
            For Android and iOS
          </p>
        </div>

        <div className="shrink-0">
          <QrCodeMock />
        </div>
      </div>
    </FooterCard>
  );
}

function FooterLinkRow({ links, children }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className={[
            "text-center text-[12px] font-semibold leading-none text-white",
            "transition-opacity duration-200 hover:opacity-75",
            "focus:outline-none focus:ring-2 focus:ring-white/50",
            "focus:ring-offset-2 focus:ring-offset-black",
          ].join(" ")}
        >
          {link.label}
        </a>
      ))}

      {children}
    </div>
  );
}

function PrivacyChoicesLink() {
  return (
    <a
      href="#"
      className={[
        "inline-flex items-center gap-1.5 text-[12px] font-semibold",
        "leading-none text-white transition-opacity duration-200",
        "hover:opacity-75 focus:outline-none focus:ring-2",
        "focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black",
      ].join(" ")}
    >
      <PrivacyChoicesIcon />
      <span>Your Ads Privacy Choices</span>
    </a>
  );
}

function PrivacyChoicesIcon() {
  return (
    <svg
      viewBox="0 0 24 16"
      aria-hidden="true"
      className="h-2.5 w-3.75 shrink-0"
      fill="none"
    >
      <rect
        x="1"
        y="3"
        width="22"
        height="10"
        rx="5"
        className="fill-[#2B84FF]"
      />
      <path
        d="M7.5 8h9"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M11 5.5 8.5 8 11 10.5"
        stroke="white"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="17.5" cy="8" r="2.2" fill="white" />
    </svg>
  );
}

function XIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 4l16 16" />
      <path d="M20 4 4 20" />
    </svg>
  );
}

function QrCodeMock() {
  return (
    <div className="rounded-sm bg-white p-[3px] shadow-[0_0_0_1px_rgba(255,255,255,0.08)]">
      <svg
        viewBox="0 0 72 72"
        aria-hidden="true"
        className="h-[44px] w-[44px] sm:h-[48px] sm:w-[48px]"
      >
        <rect width="72" height="72" fill="white" />
        <rect x="4" y="4" width="18" height="18" fill="black" />
        <rect x="8" y="8" width="10" height="10" fill="white" />
        <rect x="50" y="4" width="18" height="18" fill="black" />
        <rect x="54" y="8" width="10" height="10" fill="white" />
        <rect x="4" y="50" width="18" height="18" fill="black" />
        <rect x="8" y="54" width="10" height="10" fill="white" />
        <rect x="28" y="8" width="6" height="6" fill="black" />
        <rect x="38" y="8" width="6" height="6" fill="black" />
        <rect x="28" y="18" width="6" height="6" fill="black" />
        <rect x="38" y="18" width="6" height="6" fill="black" />
        <rect x="24" y="28" width="6" height="6" fill="black" />
        <rect x="34" y="28" width="6" height="6" fill="black" />
        <rect x="44" y="28" width="6" height="6" fill="black" />
        <rect x="54" y="28" width="6" height="6" fill="black" />
        <rect x="28" y="38" width="6" height="6" fill="black" />
        <rect x="38" y="38" width="6" height="6" fill="black" />
        <rect x="48" y="38" width="6" height="6" fill="black" />
        <rect x="58" y="38" width="6" height="6" fill="black" />
        <rect x="28" y="48" width="6" height="6" fill="black" />
        <rect x="38" y="48" width="6" height="6" fill="black" />
        <rect x="48" y="48" width="6" height="6" fill="black" />
        <rect x="58" y="48" width="6" height="6" fill="black" />
        <rect x="24" y="58" width="6" height="6" fill="black" />
        <rect x="34" y="58" width="6" height="6" fill="black" />
        <rect x="44" y="58" width="6" height="6" fill="black" />
        <rect x="54" y="58" width="6" height="6" fill="black" />
      </svg>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-245 px-4 pb-8 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-center">
          <SocialCard />
          <AppCard />
        </div>

        <nav aria-label="Footer navigation" className="mt-8">
          <div className="space-y-5">
            <FooterLinkRow links={primaryLinks} />

            <FooterLinkRow links={secondaryLinks}>
              <PrivacyChoicesLink />
            </FooterLinkRow>
          </div>
        </nav>

        <p className="mt-5 text-center text-[11px] leading-none text-white/55">
          © 2026 by Sangam.com, Inc.
        </p>
      </div>
    </footer>
  );
}
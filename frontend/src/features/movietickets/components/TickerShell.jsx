import React from "react";

const VIEWBOX_WIDTH = 1200;
const VIEWBOX_HEIGHT = 460;

function buildTicketPath(width, height, inset = 0, scoop = 58) {
  const left = inset;
  const top = inset;
  const right = width - inset;
  const bottom = height - inset;

  return [
    `M ${left + scoop} ${top}`,
    `H ${right - scoop}`,
    `Q ${right - scoop} ${top + scoop} ${right} ${top + scoop}`,
    `V ${bottom - scoop}`,
    `Q ${right - scoop} ${bottom - scoop} ${right - scoop} ${bottom}`,
    `H ${left + scoop}`,
    `Q ${left + scoop} ${bottom - scoop} ${left} ${bottom - scoop}`,
    `V ${top + scoop}`,
    `Q ${left + scoop} ${top + scoop} ${left + scoop} ${top}`,
    "Z",
  ].join(" ");
}

function svgMaskUrl(path) {
  const svg = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}"
      preserveAspectRatio="none"
    >
      <path d="${path}" fill="black" />
    </svg>
  `
    .replace(/\s+/g, " ")
    .trim();

  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

const OUTER_PATH = buildTicketPath(VIEWBOX_WIDTH, VIEWBOX_HEIGHT, 6, 62);
const INNER_PATH = buildTicketPath(VIEWBOX_WIDTH, VIEWBOX_HEIGHT, 22, 46);
const MASK_URL = svgMaskUrl(OUTER_PATH);

const ticketMaskStyle = {
  WebkitMaskImage: MASK_URL,
  maskImage: MASK_URL,
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskSize: "100% 100%",
  maskSize: "100% 100%",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

export default function TicketShell({ children }) {
  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="relative min-h-[420px]" style={ticketMaskStyle}>
        <div className="absolute inset-0 bg-[#efe9dd]" />

        <div
          className="pointer-events-none absolute inset-0 opacity-45"
          style={{
            backgroundImage: `
              radial-gradient(
                circle at 1px 1px,
                rgba(0, 0, 0, 0.12) 1px,
                transparent 0
              ),
              linear-gradient(
                180deg,
                rgba(255, 255, 255, 0.45),
                rgba(0, 0, 0, 0.03)
              )
            `,
            backgroundSize: "7px 7px, 100% 100%",
            mixBlendMode: "multiply",
          }}
        />

        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(
                122deg,
                transparent 0 14%,
                rgba(220, 38, 38, 0.08) 14% 15.2%,
                transparent 15.2% 41%,
                rgba(220, 38, 38, 0.12) 41% 42.8%,
                transparent 42.8% 100%
              ),
              linear-gradient(
                101deg,
                transparent 0 67%,
                rgba(220, 38, 38, 0.12) 67% 69%,
                transparent 69% 100%
              )
            `,
            mixBlendMode: "multiply",
          }}
        />

        <div className="relative z-10 h-full">{children}</div>

        <svg
          viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d={OUTER_PATH}
            fill="none"
            stroke="rgba(17, 17, 17, 0.96)"
            strokeWidth="3.2"
          />
          <path
            d={INNER_PATH}
            fill="none"
            stroke="rgba(17, 17, 17, 0.42)"
            strokeWidth="1.4"
          />
        </svg>
      </div>
    </div>
  );
}
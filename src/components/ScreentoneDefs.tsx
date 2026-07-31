export function ScreentoneDefs() {
  return (
    <svg className="screentone-defs" aria-hidden="true" focusable="false">
      <defs>
        <pattern
          id="tone-10"
          width="6"
          height="6"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.2" cy="1.2" r="0.9" fill="#0c0c0c" fillOpacity="0.28" />
        </pattern>
        <pattern
          id="tone-30"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.4" cy="1.4" r="1.15" fill="#0c0c0c" fillOpacity="0.55" />
        </pattern>
        <pattern
          id="tone-50"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.2" cy="1.2" r="1.2" fill="#0c0c0c" fillOpacity="0.78" />
        </pattern>
        <pattern
          id="speed-lines"
          width="24"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(-18)"
        >
          <rect width="24" height="1.5" fill="#0c0c0c" />
        </pattern>
      </defs>
    </svg>
  );
}

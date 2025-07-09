import Stripes from "@/assets/images/stripes.svg";

export default function PageIllustration() {
  return (
    <>
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 -translate-x-1/2 transform"
        aria-hidden="true"
      >
        <img
          className="max-w-none select-none mix-blend-luminosity opacity-80"
          src={Stripes}
          width={768}
          alt="Stripes"
          style={{
            filter: "var(--stripes-filter, none)",
            background: "var(--color-background)",
          }}
        />
      </div>

      <div
        className="pointer-events-none absolute -top-32 left-1/2 ml-[580px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          className="h-80 w-80 rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary), transparent 70%)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[420px] ml-[380px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          className="h-80 w-80 rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary), var(--color-background) 80%)",
          }}
        />
      </div>
      <div
        className="pointer-events-none absolute left-1/2 top-[640px] -ml-[300px] -translate-x-1/2"
        aria-hidden="true"
      >
        <div
          className="h-80 w-80 rounded-full opacity-50 blur-[160px]"
          style={{
            background:
              "radial-gradient(circle at 60% 40%, var(--color-primary), var(--color-background) 80%)",
          }}
        />
      </div>
    </>
  );
}

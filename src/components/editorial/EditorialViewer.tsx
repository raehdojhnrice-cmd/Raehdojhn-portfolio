import React, { useEffect, useMemo, useRef, useState } from "react";
import issueData from "./ranaan-ccc-editorial-data.json";

type Side = {
  theme?: "light" | "dark";
  kicker?: string;
  title?: string;
  deck?: string;
  quote?: string;
  body?: string;
  footer?: string;
  meta?: [string, string][];
  notes?: string[];
  media?: string | null;
  mediaAlt?: string;
  mediaLabel?: string;
  mediaTags?: string[];
};

type Spread = {
  id: string;
  thumbLabel: string;
  left: Side;
  right: Side;
};

type IssueData = {
  project: {
    title: string;
    subtitle?: string;
    brand?: string;
    viewer_mode?: string;
    theme?: string;
  };
  spreads: Spread[];
};

const data = issueData as IssueData;
const spreads = data.spreads;

function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

function GlassBadge({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-white/80 shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

function MediaPanel({ side, mobile = false }: { side: Side; mobile?: boolean }) {
  const hasImage = Boolean(side.media);

  return (
    <div
      className={cx(
        "relative overflow-hidden border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
        mobile
          ? "rounded-[28px] bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.28)] backdrop-blur-2xl"
          : "rounded-[18px] bg-[linear-gradient(135deg,rgba(0,0,0,0.18),rgba(255,255,255,0.12)),var(--panel)]",
        mobile ? "min-h-0" : "h-full min-h-[260px]"
      )}
    >
      <div
        className={cx(
          "relative overflow-hidden",
          mobile ? "aspect-[4/5]" : "h-full min-h-[260px]"
        )}
      >
        {!hasImage && (
          <>
            <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
            <div className="absolute bottom-[18px] left-[22px] z-[1] text-[10px] uppercase tracking-[0.24em] text-[rgba(240,235,226,0.72)]">
              {side.mediaLabel || "Add image"}
            </div>
          </>
        )}

        {hasImage ? (
          <img
            src={side.media || undefined}
            alt={side.mediaAlt || side.mediaLabel || "Editorial image"}
            className="block h-full w-full object-cover saturate-[0.92] contrast-[1.03]"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-0 z-[2]">
          <div className="absolute left-4 top-4 h-4 w-4 border-l border-t border-white/25" />
          <div className="absolute bottom-4 right-4 h-4 w-4 border-b border-r border-white/25" />
          {mobile ? (
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),transparent_28%,transparent_72%,rgba(0,0,0,0.18))]" />
          ) : null}
        </div>

        {(side.mediaTags || []).slice(0, mobile ? 2 : 3).map((tag, idx) => {
          const pos = mobile
            ? ["right-4 top-4", "bottom-4 left-4"][idx]
            : ["top-4 right-4", "bottom-[18px] left-[18px]", "right-[18px] top-1/2 -translate-y-1/2"][idx];

          return (
            <div
              key={`${tag}-${idx}`}
              className={cx(
                "absolute z-[3] rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[9px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.62)] backdrop-blur-[6px]",
                pos
              )}
            >
              {tag}
            </div>
          );
        })}
      </div>

      {mobile ? (
        <div className="border-t border-white/12 bg-white/8 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-[#f0ebe2]/72 backdrop-blur-xl">
          {side.footer || side.mediaLabel || "Campaign image"}
        </div>
      ) : null}
    </div>
  );
}

function TextPage({ side, pageNumber, mobile = false }: { side: Side; pageNumber: number; mobile?: boolean }) {
  const dark = side.theme === "dark";

  return (
    <section
      className={cx(
        "relative flex min-h-0 flex-col justify-between overflow-hidden",
        mobile
          ? "rounded-[28px] border shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl"
          : "px-7 py-7",
        dark
          ? mobile
            ? "border-white/12 bg-[linear-gradient(180deg,rgba(18,18,18,0.72),rgba(10,10,10,0.66))] text-[#f0ebe2]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#0d0d0d,#141414)] text-[#f0ebe2]"
          : mobile
            ? "border-white/20 bg-[linear-gradient(180deg,rgba(240,235,226,0.62),rgba(231,223,209,0.54))] text-[#101010]"
            : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(0,0,0,0.03))] text-[#101010]"
      )}
    >
      <div
        className={cx(
          "pointer-events-none absolute inset-0",
          mobile
            ? "opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:24px_24px]"
            : "opacity-10 mix-blend-multiply [background-image:linear-gradient(rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:24px_24px]",
          dark && !mobile && "mix-blend-screen opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]",
          !dark && mobile && "opacity-10 [background-image:linear-gradient(rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.06)_1px,transparent_1px)]",
          mobile && "before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.08),transparent_36%,rgba(0,0,0,0.08))] before:content-['']"
        )}
      />

      <div className={cx("relative z-[1] flex items-center justify-between gap-4", mobile ? "border-b border-white/10 px-5 py-4" : "") }>
        <div className={cx("text-[10px] uppercase tracking-[0.26em]", dark ? "text-[#f0ebe2]/65" : "text-[#8e857b]")}>{side.kicker || "Spread"}</div>
        <div className={cx("text-[10px] tracking-[0.28em]", dark ? "text-[#f0ebe2]/65" : "text-black/60")}>{String(pageNumber).padStart(2, "0")}</div>
      </div>

      <div className={cx("relative z-[1] flex h-full flex-col justify-center gap-4", mobile ? "px-5 py-5" : "py-4")}>
        {side.title ? (
          <h2 className={cx(
            "m-0 whitespace-pre-line font-['Bebas_Neue'] uppercase leading-[0.92] tracking-[0.04em]",
            mobile ? "text-[clamp(2.2rem,10vw,4.6rem)]" : "text-[clamp(2.4rem,5vw,6rem)]"
          )}>
            {side.title}
          </h2>
        ) : null}

        {side.deck ? (
          <p className={cx(
            "m-0 max-w-[32ch] font-['Playfair_Display'] italic",
            mobile ? "text-[clamp(0.95rem,3.8vw,1.15rem)]" : "text-[clamp(0.95rem,1.15vw,1.1rem)]",
            dark ? "text-[#f0ebe2]/76" : "text-black/65"
          )}>
            {side.deck}
          </p>
        ) : null}

        {side.quote ? (
          <blockquote className={cx(
            "m-0 max-w-[14ch] font-['Playfair_Display'] italic leading-[1.2]",
            mobile ? "text-[clamp(1.2rem,5vw,1.8rem)]" : "text-[clamp(1.25rem,1.9vw,1.9rem)]"
          )}>
            {side.quote}
          </blockquote>
        ) : null}

        {side.body ? (
          <div className={cx("max-w-[48ch] text-[13px] leading-[1.85]", dark ? "text-[#f0ebe2]/80" : "text-black/80")}>{side.body}</div>
        ) : null}

        {side.meta?.length ? (
          <div className="mt-2 grid gap-2">
            {side.meta.map(([k, v]) => (
              <div key={`${k}-${v}`} className={cx(
                mobile
                  ? "grid grid-cols-[88px_minmax(0,1fr)] gap-3 border-t pt-2"
                  : "flex items-start justify-between gap-4 border-t pt-2",
                "text-[10px] uppercase tracking-[0.22em]",
                dark ? "border-white/10 text-[#f0ebe2]/70" : "border-black/10 text-black/65"
              )}>
                <span>{k}</span>
                <span className={cx(mobile ? "text-right" : "text-right")}>{v}</span>
              </div>
            ))}
          </div>
        ) : null}

        {side.notes?.length ? (
          <div className={cx("mt-2 grid gap-1 text-[10px] uppercase tracking-[0.18em]", dark ? "text-[#f0ebe2]/60" : "text-black/55")}>
            {side.notes.map((note) => (
              <div key={note}>{note}</div>
            ))}
          </div>
        ) : null}
      </div>

      <div className={cx(
        "relative z-[1] flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] before:h-px before:w-5 before:bg-current before:opacity-50 before:content-['']",
        mobile ? "border-t px-5 py-4" : "",
        dark ? "border-white/10 text-[#f0ebe2]/70" : "border-black/10 text-black/64"
      )}>
        {side.footer || "Editorial page"}
      </div>
    </section>
  );
}

function DesktopMagazinePage({ side, pageNumber }: { side: Side; pageNumber: number }) {
  const usesMedia = side.media !== undefined || side.mediaLabel;

  if (!usesMedia) return <TextPage side={side} pageNumber={pageNumber} />;

  const dark = side.theme === "dark";

  return (
    <section
      className={cx(
        "relative flex min-h-0 flex-col justify-between overflow-hidden px-7 py-7",
        dark
          ? "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.06),transparent_30%),linear-gradient(180deg,#0d0d0d,#141414)] text-[#f0ebe2]"
          : "bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.35),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(0,0,0,0.03))] text-[#101010]"
      )}
    >
      <div className={cx(
        "pointer-events-none absolute inset-0 opacity-10 mix-blend-multiply [background-image:linear-gradient(rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.12)_1px,transparent_1px)] [background-size:24px_24px]",
        dark && "mix-blend-screen opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]"
      )} />

      <div className="relative z-[1] mb-4 flex items-center justify-between gap-4">
        <div className={cx("text-[10px] uppercase tracking-[0.26em]", dark ? "text-[#f0ebe2]/65" : "text-[#8e857b]")}>{side.kicker || "Spread"}</div>
        <div className={cx("text-[10px] tracking-[0.28em]", dark ? "text-[#f0ebe2]/65" : "text-black/60")}>{String(pageNumber).padStart(2, "0")}</div>
      </div>

      <MediaPanel side={side} />

      <div className="relative z-[1] mt-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em] text-black/65 before:h-px before:w-5 before:bg-current before:opacity-50 before:content-[''] dark:text-[#f0ebe2]/70">
        {side.footer || side.mediaLabel || "Campaign image"}
      </div>
    </section>
  );
}

function MobileSpreadCard({ spread, index, active }: { spread: Spread; index: number; active: boolean }) {
  return (
    <section className={cx("snap-start transition-all duration-500 ease-out", active ? "translate-y-0 opacity-100" : "translate-y-1 opacity-70")}>
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="text-[10px] uppercase tracking-[0.24em] text-white/55">{spread.thumbLabel}</div>
        <GlassBadge>{String(index + 1).padStart(2, "0")}</GlassBadge>
      </div>

      <div className="grid gap-4">
        {(spread.left.media !== undefined || spread.left.mediaLabel)
          ? <MediaPanel side={spread.left} mobile />
          : <TextPage side={spread.left} pageNumber={index * 2 + 1} mobile />}
        {(spread.right.media !== undefined || spread.right.mediaLabel)
          ? <MediaPanel side={spread.right} mobile />
          : <TextPage side={spread.right} pageNumber={index * 2 + 2} mobile />}
      </div>
    </section>
  );
}

export default function EditorialViewer() {
  const issueSpreads = useMemo(() => spreads, []);

  const [desktopCurrent, setDesktopCurrent] = useState(0);
  const [mobileCurrent, setMobileCurrent] = useState(0);
  const [isFitMode, setIsFitMode] = useState(false);
  const [desktopAnimating, setDesktopAnimating] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);

  const desktopThumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const mobileCardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const mobileScrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const desktop = window.innerWidth >= 821;
      if (!desktop) return;
      if (e.key === "ArrowRight") desktopGoTo(desktopCurrent + 1);
      if (e.key === "ArrowLeft") desktopGoTo(desktopCurrent - 1);
      if (e.key.toLowerCase() === "f") setIsFitMode((v) => !v);
      if (e.key.toLowerCase() === "t") {
        desktopThumbRefs.current[desktopCurrent]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
        desktopThumbRefs.current[desktopCurrent]?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [desktopCurrent]);

  useEffect(() => {
    desktopThumbRefs.current[desktopCurrent]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [desktopCurrent]);

  useEffect(() => {
    const scroller = mobileScrollerRef.current;
    if (!scroller) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) {
          const index = Number((visible.target as HTMLElement).dataset.index || 0);
          setMobileCurrent(index);
        }
      },
      {
        root: scroller,
        threshold: [0.35, 0.55, 0.75],
      }
    );

    mobileCardRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [issueSpreads]);

  const desktopGoTo = (index: number) => {
    if (desktopAnimating) return;
    if (index < 0 || index >= issueSpreads.length || index === desktopCurrent) return;
    setDesktopAnimating(true);
    setDesktopCurrent(index);
    window.setTimeout(() => setDesktopAnimating(false), 620);
  };

  const mobileGoTo = (index: number) => {
    const node = mobileCardRefs.current[index];
    if (!node) return;
    node.scrollIntoView({ behavior: "smooth", block: "start" });
    setTocOpen(false);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_22%),linear-gradient(180deg,#151515_0%,#0b0b0b_52%,#070707_100%)] text-white">
      <div className="pointer-events-none fixed inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(circle_at_center,black_42%,transparent_88%)]" />
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_20%),radial-gradient(circle_at_bottom_right,rgba(75,31,42,0.2),transparent_24%)]" />

      {/* Desktop / tablet layout */}
      <div className="hidden min-[821px]:grid h-screen grid-cols-[86px_minmax(0,1fr)_86px] grid-rows-[72px_minmax(0,1fr)_96px] max-[1100px]:grid-cols-[60px_minmax(0,1fr)_60px] max-[1100px]:grid-rows-[72px_minmax(0,1fr)_120px]">
        <header className="col-span-full flex items-center justify-between gap-4 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] px-6 py-[18px] backdrop-blur-2xl">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">Responsive Editorial Viewer</div>
            <div className="truncate font-['Bebas_Neue'] text-[30px] uppercase leading-[0.92] tracking-[0.06em]">
              {data.project.title}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => desktopThumbRefs.current[desktopCurrent]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })}
              className="h-9 rounded-full border border-white/15 bg-white/10 px-4 text-[10px] uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:-translate-y-[1px] hover:bg-white/14"
            >
              Contents
            </button>
            <button
              type="button"
              onClick={() => setIsFitMode((v) => !v)}
              className="h-9 rounded-full border border-white/15 bg-white/10 px-4 text-[10px] uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl transition hover:-translate-y-[1px] hover:bg-white/14"
            >
              {isFitMode ? "Standard View" : "Fullscreen Spread"}
            </button>
            <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
              {String(desktopCurrent + 1).padStart(2, "0")} / {String(issueSpreads.length).padStart(2, "0")}
            </div>
          </div>
        </header>

        <aside className="flex items-center justify-center p-3">
          <button
            type="button"
            onClick={() => desktopGoTo(desktopCurrent - 1)}
            disabled={desktopCurrent === 0}
            className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:-translate-y-[1px] hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Previous spread"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
        </aside>

        <main className="relative grid min-h-0 min-w-0 place-items-center overflow-hidden px-[clamp(12px,2vw,22px)] pb-3 pt-[22px]">
          <div className="pointer-events-none absolute h-[min(70vh,760px)] w-[min(78vw,1080px)] translate-y-[4%] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.07)_0%,transparent_70%)] blur-[20px]" />

          <div className={cx("relative w-full max-w-[1440px] min-w-0", isFitMode ? "h-[82vh]" : "h-[min(76vh,calc((100vw-280px)*0.58))] min-h-[420px]")}>
            <div className="relative h-full w-full [transform-style:preserve-3d]">
              {issueSpreads.map((spread, index) => {
                const isActive = index === desktopCurrent;
                const isBefore = index < desktopCurrent;
                const isAfter = index > desktopCurrent;

                return (
                  <article
                    key={spread.id}
                    className={cx(
                      "absolute inset-0 grid grid-cols-2 overflow-hidden rounded-[22px] bg-[linear-gradient(180deg,#ede5d8,#e7dfd1)] text-[#101010] shadow-[0_30px_80px_rgba(0,0,0,0.5)] transition-[transform,opacity] duration-[620ms] [transform-origin:center_center]",
                      isActive && "z-[4] translate-x-0 rotate-y-0 scale-100 opacity-100 pointer-events-auto",
                      isBefore && "z-[2] -translate-x-[70px] rotate-y-[14deg] scale-[0.98] opacity-0 pointer-events-none",
                      isAfter && "z-[2] translate-x-[70px] -rotate-y-[14deg] scale-[0.98] opacity-0 pointer-events-none",
                      !isActive && !isBefore && !isAfter && "translate-x-[60px] -rotate-y-[10deg] scale-[0.985] opacity-0 pointer-events-none",
                      desktopAnimating && isActive && "will-change-transform"
                    )}
                  >
                    <div className="pointer-events-none absolute inset-y-0 left-1/2 z-[3] hidden w-[22px] -translate-x-1/2 bg-[linear-gradient(90deg,rgba(0,0,0,0.15),rgba(255,255,255,0.08),rgba(0,0,0,0.15))] opacity-65 md:block" />
                    <div className="pointer-events-none absolute inset-y-0 right-0 z-[3] w-[22px] bg-[linear-gradient(90deg,transparent,rgba(0,0,0,0.08))] opacity-45" />

                    {(spread.left.media !== undefined || spread.left.mediaLabel)
                      ? <DesktopMagazinePage side={spread.left} pageNumber={index * 2 + 1} />
                      : <TextPage side={spread.left} pageNumber={index * 2 + 1} />}
                    {(spread.right.media !== undefined || spread.right.mediaLabel)
                      ? <DesktopMagazinePage side={spread.right} pageNumber={index * 2 + 2} />
                      : <TextPage side={spread.right} pageNumber={index * 2 + 2} />}
                  </article>
                );
              })}
            </div>
          </div>

          <div className="absolute bottom-[18px] right-[18px] z-[8] rounded-[14px] border border-white/12 bg-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#f0ebe2]/70 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
            Desktop spread mode / shared JSON issue data
          </div>
        </main>

        <aside className="flex items-center justify-center p-3">
          <button
            type="button"
            onClick={() => desktopGoTo(desktopCurrent + 1)}
            disabled={desktopCurrent === issueSpreads.length - 1}
            className="flex h-[54px] w-[54px] items-center justify-center rounded-full border border-white/15 bg-white/10 shadow-[0_18px_40px_rgba(0,0,0,0.28)] backdrop-blur-2xl transition hover:-translate-y-[1px] hover:bg-white/14 disabled:cursor-not-allowed disabled:opacity-35"
            aria-label="Next spread"
          >
            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg>
          </button>
        </aside>

        {!isFitMode ? (
          <footer className="col-span-full grid grid-cols-[180px_minmax(0,1fr)_150px] items-center gap-4 border-t border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] px-5 pb-[18px] pt-3 backdrop-blur-2xl max-[1100px]:grid-cols-1">
            <div className="min-w-0 text-white/55 max-[1100px]:hidden">
              <div className="text-[10px] uppercase tracking-[0.22em]">Issue Build</div>
              <div className="mt-1 grid gap-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
                <div>Responsive editorial viewer with desktop spreads and mobile glassmorphic stack.</div>
              </div>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1 [scrollbar-color:rgba(255,255,255,0.18)_transparent] [scrollbar-width:thin]">
              {issueSpreads.map((spread, index) => {
                const imgSrc = spread.right.media || spread.left.media;
                return (
                  <button
                    key={spread.id}
                    ref={(el) => {
                      desktopThumbRefs.current[index] = el;
                    }}
                    type="button"
                    onClick={() => desktopGoTo(index)}
                    className={cx(
                      "grid w-[142px] flex-none gap-2 rounded-[16px] border px-2 py-2 text-left transition backdrop-blur-xl",
                      index === desktopCurrent
                        ? "border-white/20 bg-white/14 shadow-[0_10px_25px_rgba(0,0,0,0.22)]"
                        : "border-white/10 bg-white/7 hover:-translate-y-[2px] hover:bg-white/12"
                    )}
                  >
                    <div className={cx(
                      "relative aspect-[1.6/1] overflow-hidden rounded-[12px] border border-white/10 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
                      imgSrc
                        ? "bg-neutral-900"
                        : "bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_25%),linear-gradient(135deg,#191919,#0e0e0e_55%,#1a0a0a)]"
                    )}>
                      {imgSrc ? (
                        <img src={imgSrc} alt={spread.thumbLabel} className="block h-full w-full object-cover saturate-90 contrast-[1.02]" />
                      ) : (
                        <>
                          <div className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:28px_28px]" />
                          <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-[0.22em] text-[#f0ebe2]/70">{spread.thumbLabel}</div>
                        </>
                      )}
                    </div>

                    <div className="grid gap-[3px] min-w-0">
                      <div className="truncate font-['Bebas_Neue'] text-[11px] uppercase tracking-[0.06em] text-white">{spread.thumbLabel}</div>
                      <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">
                        {String(index + 1).padStart(2, "0")} / {String(issueSpreads.length).padStart(2, "0")}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="min-w-0 text-white/55 max-[1100px]:hidden">
              <div className="text-[10px] uppercase tracking-[0.22em]">Keys</div>
              <div className="mt-1 grid gap-1 text-[10px] uppercase tracking-[0.18em]">
                <div>← → navigate · T contents · F fit spread</div>
              </div>
            </div>
          </footer>
        ) : null}
      </div>

      {/* Mobile layout */}
      <div className="min-[821px]:hidden">
        <header className="sticky top-0 z-30 border-b border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.05))] px-4 py-3 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/8">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/55">Mobile Editorial Viewer</div>
              <div className="truncate font-['Bebas_Neue'] text-[26px] uppercase leading-[0.92] tracking-[0.06em]">
                {data.project.title}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setTocOpen((v) => !v)}
              className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-white shadow-[0_10px_30px_rgba(0,0,0,0.16)] backdrop-blur-xl"
            >
              {tocOpen ? "Close" : "Contents"}
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <GlassBadge>{String(mobileCurrent + 1).padStart(2, "0")} / {String(issueSpreads.length).padStart(2, "0")}</GlassBadge>
            <div className="truncate text-[10px] uppercase tracking-[0.2em] text-white/55">
              {issueSpreads[mobileCurrent]?.thumbLabel}
            </div>
          </div>
        </header>

        {tocOpen ? (
          <div className="sticky top-[88px] z-20 mx-4 mt-3 rounded-[24px] border border-white/12 bg-white/10 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
            <div className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/55">Issue Contents</div>
            <div className="grid gap-2">
              {issueSpreads.map((spread, index) => (
                <button
                  key={spread.id}
                  type="button"
                  onClick={() => mobileGoTo(index)}
                  className={cx(
                    "flex items-center justify-between rounded-[18px] border px-3 py-3 text-left transition",
                    index === mobileCurrent ? "border-white/18 bg-white/14" : "border-white/8 bg-white/5"
                  )}
                >
                  <div className="min-w-0">
                    <div className="font-['Bebas_Neue'] text-[15px] uppercase tracking-[0.06em] text-white">{spread.thumbLabel}</div>
                    <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/55">
                      {spread.left.kicker || spread.right.kicker || "Spread"}
                    </div>
                  </div>
                  <GlassBadge>{String(index + 1).padStart(2, "0")}</GlassBadge>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <main
          ref={mobileScrollerRef}
          className="relative z-[1] h-[calc(100vh-88px)] overflow-y-auto px-4 pb-24 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto grid max-w-[560px] gap-10">
            {issueSpreads.map((spread, index) => (
              <div
                key={spread.id}
                ref={(el) => {
                  mobileCardRefs.current[index] = el;
                }}
                data-index={index}
              >
                <MobileSpreadCard spread={spread} index={index} active={index === mobileCurrent} />
              </div>
            ))}
          </div>
        </main>

        <div className="pointer-events-none fixed bottom-4 left-1/2 z-20 w-[calc(100%-2rem)] max-w-[560px] -translate-x-1/2 rounded-[22px] border border-white/12 bg-white/10 px-4 py-3 text-[10px] uppercase tracking-[0.18em] text-white/62 shadow-[0_18px_50px_rgba(0,0,0,0.24)] backdrop-blur-2xl">
          Swipe vertically through spreads · Tap contents to jump between sections
        </div>
      </div>
    </div>
  );
}

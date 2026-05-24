import { Link } from 'react-router-dom'
import V4ArchiveUploadGrid from '../components/v4/V4ArchiveUploadGrid'
import V4ContactTerminal from '../components/v4/V4ContactTerminal'
import V4DesktopShell from '../components/v4/V4DesktopShell'
import V4IdentityRail from '../components/v4/V4IdentityRail'
import V4MotionFramework from '../components/v4/V4MotionFramework'
import V4RedCursor from '../components/v4/V4RedCursor'
import V4WindowChrome from '../components/v4/V4WindowChrome'
import '../styles/v4-chaos-lux.css'

const ARCHIVE_LINKS = [
  { label: 'Back to V4 index', href: '/v4' },
  { label: 'Read on Substack', href: 'https://raehdojhn.substack.com', external: true },
  { label: 'Read on Medium', href: 'https://medium.com/@raehdojhn', external: true },
]

export default function V4ArchiveWorkPage() {
  return (
    <div className="v4-page v4-page--archive">
      <V4MotionFramework />
      <V4RedCursor />
      <V4DesktopShell />
      <div className="v4-noise" aria-hidden="true" />
      <V4IdentityRail portalTo="/v4" portalLabel="Back to V4 Index" />

      <main className="v4-main">
        <V4WindowChrome
          title="Archive Cover"
          serial="ARCH-00 / OPEN"
          status="Upload ready"
          revealIndex={0}
          metaLabel="ARCHIVE ENTRY"
          metaValue="COVER / EXPERIMENTAL INDEX / OPEN WALL"
          chips={['CHAOTIC INPUT', 'REFERENCE PILE', 'LIVE VIEWERS']}
        >
          <section id="hero" className="v4-archive-hero" data-v4-animate>
            <div className="v4-archive-hero__meta">
              <p className="v4-kicker">CHAOTIC CREATIVE EXPERIMENTALISM / CURATED DISORDER</p>
              <h1 className="v4-title">
                CHAOTIC ARCHIVE
                <br />
                OF UNRELATED WORK
              </h1>
              <p className="v4-copy">
                Upload experiments, mockups, references, failures, and raw process snapshots into one living visual wall.
              </p>
              <div className="v4-hero__routes" aria-label="Archive routes">
                <a href="#work" className="v4-hero__route">Open upload wall</a>
                <a href="#contact" className="v4-hero__route">Contact</a>
                <Link to="/v4" className="v4-hero__route">Return to V4 index</Link>
              </div>
            </div>

            <div className="v4-archive-hero__plate" aria-hidden="true">
              <p>ISSUE: RAE-26-ARCHIVE</p>
              <p>MODE: TUMBLR BENTO / LIVE INPUT</p>
              <p>VIEWERS: GRID / REEL / STACK-BOOK</p>
              <p>SERIAL: CHAOS-WALL-01</p>
            </div>
          </section>
        </V4WindowChrome>

        <V4WindowChrome
          title="Upload Wall"
          serial="ARCH-01 / GRID"
          status="Grid / Reel / Stack"
          tone="accent"
          revealIndex={1}
          metaLabel="ARCHIVE VIEWERS"
          metaValue="BENTO / REEL / STACK-BOOK / LOCAL SAVE"
          chips={['UPLOAD READY', 'STRICT VALIDATION', 'MODE MEMORY']}
        >
          <V4ArchiveUploadGrid />
        </V4WindowChrome>

        <V4WindowChrome
          title="Contact Terminal"
          serial="ARCH-02 / OUTBOUND"
          status="Open channel"
          revealIndex={2}
          metaLabel="ARCHIVE OUTBOUND"
          metaValue="SUBSTACK / MEDIUM / DIRECT CONTACT"
          chips={['RETURN ROUTE', 'PUBLISHING LINKS', 'OPEN CHANNEL']}
        >
          <V4ContactTerminal links={ARCHIVE_LINKS} />
        </V4WindowChrome>
      </main>
    </div>
  )
}

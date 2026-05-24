import V4ArtifactHero from '../components/v4/V4ArtifactHero'
import V4CapabilityDeck from '../components/v4/V4CapabilityDeck'
import V4DesktopShell from '../components/v4/V4DesktopShell'
import V4IdentityRail from '../components/v4/V4IdentityRail'
import V4ImagePromptFlux from '../components/v4/V4ImagePromptFlux'
import V4IOSVideoPlayer from '../components/v4/V4IOSVideoPlayer'
import V4IPodClassicPlayer from '../components/v4/V4IPodClassicPlayer'
import V4ProjectLedger from '../components/v4/V4ProjectLedger'
import V4LabSplat from '../components/v4/V4LabSplat'
import V4MembershipForm from '../components/v4/V4MembershipForm'
import V4ContactTerminal from '../components/v4/V4ContactTerminal'
import V4MediaConsumed from '../components/v4/V4MediaConsumed'
import V4MotionFramework from '../components/v4/V4MotionFramework'
import V4RedCursor from '../components/v4/V4RedCursor'
import V4TerminalWindow from '../components/v4/V4TerminalWindow'
import V4WindowChrome from '../components/v4/V4WindowChrome'
import V4CursorTrail from '../components/v4/V4CursorTrail'
import V4FloatingSticker from '../components/v4/V4FloatingSticker'

import { useV4PlayerPaletteTheme } from '../components/v4/useV4PlayerPaletteTheme'
import '../styles/v4-chaos-lux.css'

export default function V4ChaosLuxPage() {
  useV4PlayerPaletteTheme()

  return (
    <div className="v4-page">
      <V4MotionFramework />
      <V4RedCursor />
      <V4CursorTrail />
      <V4FloatingSticker />
      <V4DesktopShell />
      <V4IPodClassicPlayer />
      <div className="v4-noise" aria-hidden="true" />
      <V4IdentityRail />
      <V4TerminalWindow />


      {/* ── Desktop canvas: windows float freely ── */}
      <div className="v4-desktop-canvas">
        <V4WindowChrome
          title="Artifact Overview"
          serial="APP-00 / FRONT DESK"
          status="Live shell"
          revealIndex={0}
          windowId="app-artifact"
          metaLabel="ENTRY STATE"
          metaValue="DESKTOP / INTRO / ALTER-EGO SURFACE"
          chips={['REFERENCE SYNTHESIS', 'ARCHIVE CHROME', 'PRIMARY PORTAL']}
        >
          <V4ArtifactHero />
        </V4WindowChrome>

        <V4WindowChrome
          title="Playback Deck"
          serial="APP-01 / MEDIA"
          status="QuickTime relay"
          revealIndex={1}
          windowId="app-playback"
          metaLabel="MEDIA RELAY"
          metaValue="WATCHBOARD / VIDEO / CATALOG INPUT"
          chips={['QUICKTIME LOGIC', 'PLAYLIST MEMORY', 'EMBED READY']}
        >
          <V4IOSVideoPlayer />
        </V4WindowChrome>

        <V4WindowChrome
          title="Project Ledger"
          serial="APP-03 / LEDGER"
          status="Editable"
          revealIndex={2}
          windowId="app-ledger"
          metaLabel="WORK SYSTEM"
          metaValue="LEDGER / CAPABILITIES / CLIENT-FACING DOSSIER"
          chips={['PROJECT INDEX', 'SERVICE MODEL', 'LIVE RECORD']}
        >
          <V4ProjectLedger />
          <V4CapabilityDeck />
        </V4WindowChrome>

        <V4WindowChrome
          title="Prompt Flux"
          serial="APP-04 / IMAGE CONTEXT"
          status="Indexed"
          revealIndex={3}
          windowId="app-prompt"
          metaLabel="IMAGE ENGINE"
          metaValue="CONTEXT / COLOR CHAOS / JSON PROFILE BANK"
          chips={['LOCKED ACCESS', 'GENERATION SYSTEM', 'PALETTE DNA']}
        >
          <V4ImagePromptFlux />
        </V4WindowChrome>

        <V4WindowChrome
          title="Chaos Lab"
          serial="APP-05 / LAB"
          status="Signal active"
          tone="accent"
          revealIndex={4}
          windowId="app-lab"
          metaLabel="EXPERIMENTAL MODULE"
          metaValue="BRUSH / MEMBERSHIP / VISUAL TESTBED"
          chips={['OPT-IN CHAOS', 'INTERACTION LAB', 'CONTROLLED DISORDER']}
        >
          <V4LabSplat />
          <V4MembershipForm />
        </V4WindowChrome>

        <V4WindowChrome
          title="Contact Terminal"
          serial="APP-06 / OUTBOUND"
          status="Open channel"
          revealIndex={5}
          windowId="app-contact"
          metaLabel="OUTBOUND LINK"
          metaValue="EMAIL / MEMBERSHIP / WRITING PORTALS"
          chips={['SELECT COLLABS', 'OPEN CHANNEL', 'ARCHIVE EXIT']}
        >
          <V4ContactTerminal />
        </V4WindowChrome>

        <V4WindowChrome
          title="Media Log"
          serial="APP-07 / CONSUMPTION"
          status="Updated regularly"
          revealIndex={6}
          windowId="app-media-log"
          metaLabel="CULTURAL INPUT"
          metaValue="YOUTUBE / SPOTIFY / SOUNDCLOUD / ARTICLES"
          chips={['MUSIC', 'VIDEO', 'READING', 'CULTURE']}
        >
          <V4MediaConsumed />
        </V4WindowChrome>
      </div>
    </div>
  )
}

#!/bin/bash
cd src/components/v4

missing=(
  V4CapabilityDeck 
  V4IdentityRail 
  V4ImagePromptFlux 
  V4ProjectLedger 
  V4ContactTerminal 
  V4MotionFramework 
  V4RedCursor 
  V4TerminalWindow 
  V4WindowChrome 
  V4CursorTrail 
  V4FloatingSticker
)

for file in "${missing[@]}"; do
  if [ "$file" = "V4WindowChrome" ]; then
    cat << 'INNER' > "${file}.jsx"
export default function V4WindowChrome({ children, title }) {
  return (
    <div className="v4-window-chrome" style={{ border: '1px solid #333', margin: '1rem', padding: '1rem', background: '#0a0a0a' }}>
      <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid #333', marginBottom: '1rem', color: '#888', fontSize: '0.8rem', fontFamily: 'monospace' }}>{title || 'V4 Window'}</div>
      {children}
    </div>
  )
}
INNER
  else
    cat << INNER > "${file}.jsx"
export default function ${file}() {
  return null;
}
INNER
  fi
done

echo "Stubs created."

export default function ArchiveDivider({ left = 'ARCHIVE LOG', right = 'SERIES 01' }) {
  return (
    <div style={{ margin: '28px 0 22px' }}>
      <div className="archive-meta-row">
        <span className="archive-chip" style={{ fontSize: '8px' }}>{left}</span>
        <span className="archive-meta-row__line" />
        <span className="archive-chip" style={{ fontSize: '8px' }}>{right}</span>
      </div>
      <div className="ako-gridline" style={{ marginTop: 10 }} />
    </div>
  )
}

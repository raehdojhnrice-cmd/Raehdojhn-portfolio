export default function ArchiveSectionChrome({
  index = "01",
  label = "Section",
  issue = "RAE-26-001",
  stamp,
  title,
  subtitle,
}) {
  const safeStamp = stamp || new Date().toISOString().slice(0, 10);
  return (
    <div className="archive-section-chrome">
      <div className="archive-kicker">
        <span className="archive-chip">{issue}</span>
        <span className="archive-dot" />
        <span>{index}</span>
        <span className="archive-dot" />
        <span>{label}</span>
        <span className="archive-dot" />
        <span>{safeStamp}</span>
      </div>
      <h2 className="section__title">{title}</h2>
      {subtitle ? <p className="section__subtitle">{subtitle}</p> : null}
      <div className="archive-rule" aria-hidden="true" />
    </div>
  );
}

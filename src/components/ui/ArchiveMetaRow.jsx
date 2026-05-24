export default function ArchiveMetaRow({ left, right }) {
  return (
    <div className="archive-meta-row">
      <span>{left}</span>
      <span className="archive-meta-row__line" />
      <span>{right}</span>
    </div>
  );
}

import React from 'react';
import V4WindowChrome from './V4WindowChrome';

export default function V4SeoulsticeMock() {
  return (
    <div className="v4-seoulstice-container" style={{ padding: '20px 0' }}>
      <V4WindowChrome
        title="BRAND ARCHIVE // SEOULSTICE"
        serial="SS-2026-V1"
        status="ACTIVE"
        metaLabel="PROJECT"
        metaValue="SEOULSTICE RITUAL RETAIL"
        chips={['RETAIL', 'TUMBLR', 'BRANDING', 'DAWN']}
      >
        <div style={{ position: 'relative', width: '100%', height: '800px', background: '#cfc6b9', overflow: 'hidden' }}>
          <iframe
            src="/projects/seoulstice/index.html"
            title="Seoulstice Brand Mock"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              transform: 'scale(1)',
              transformOrigin: 'top left',
            }}
          />
        </div>
      </V4WindowChrome>
      
      <div className="v4-editorial-text" style={{ marginTop: '24px', maxWidth: '800px' }}>
        <p style={{ opacity: 0.8, fontSize: '13px', lineHeight: '1.6' }}>
          Seoulstice (설스티스) is a soft American Apparel / Tumblr 2010s-inspired mock retail site for a skincare house built around ritual, renewal, dawn light, and old-web residue. This project explores the intersection of tactile campaign archives and Korean-English micrographics within a Windows-style desktop shell.
        </p>
      </div>
    </div>
  );
}

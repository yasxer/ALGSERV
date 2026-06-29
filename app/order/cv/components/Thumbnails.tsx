export function BlueThumbnail() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <div style={{ padding: '8px 10px', display: 'flex', gap: '6px', alignItems: 'center', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#E0E7EF', border: '1.5px solid #1B4F8C', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: '5px', background: '#0F172A', borderRadius: '2px', width: '55%', marginBottom: '3px' }} />
          <div style={{ height: '3px', background: '#1B4F8C', borderRadius: '2px', width: '35%' }} />
        </div>
      </div>
      <div style={{ height: '8px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', gap: '4px', alignItems: 'center', padding: '0 10px' }}>
        {[30,40,25].map((w, i) => <div key={i} style={{ height: '2px', background: '#CBD5E1', borderRadius: '1px', width: `${w}%` }} />)}
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '38%', background: '#F4F7FB', padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[['1B4F8C',70],['1B4F8C',55],['1B4F8C',45]].map(([c,w], i) => (
            <div key={i}>
              <div style={{ height: '2px', background: `#${c}`, width: `${w}%`, marginBottom: '3px', opacity: 0.6 }} />
              {[80,60].map((_bw,j) => (
                <div key={j} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {[1,2,3,4,5].map(k => <div key={k} style={{ flex: 1, height: '2px', borderRadius: '1px', background: k <= (j === 0 ? 4 : 3) ? '#1B4F8C' : '#D1DCE8' }} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ height: '2px', background: '#1B4F8C', width: '70%', marginBottom: '3px', opacity: 0.6 }} />
          {[85,65,75,50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'flex-start' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1B4F8C', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: '3px', background: '#1a1a1a', width: `${w}%`, borderRadius: '1px', marginBottom: '2px' }} />
                <div style={{ height: '2px', background: '#CBD5E1', width: `${w * 0.7}%`, borderRadius: '1px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ClassicThumbnail() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'serif', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', padding: '10px 8px 6px', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ height: '7px', background: '#111', borderRadius: '1px', width: '55%', margin: '0 auto 3px' }} />
        <div style={{ height: '2px', background: '#ccc', borderRadius: '1px', width: '15%', margin: '0 auto 5px' }} />
        <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '1.5px solid #1B4F8C', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#E0E7EF' }} />
        </div>
        <div style={{ height: '16px', border: '1px solid #93c5fd', borderRadius: '2px', margin: '0 4px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2px' }}>
          {[70,85,60].map((w,i) => <div key={i} style={{ height: '2px', background: '#cbd5e1', borderRadius: '1px', width: `${w * 0.35}px` }} />)}
        </div>
      </div>
      {/* Columns */}
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '38%', borderRight: '1px solid #e5e7eb', padding: '4px 4px 4px 6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[60,50,45].map((w, i) => (
            <div key={i}>
              <div style={{ height: '2px', background: '#1B4F8C', width: `${w}%`, marginBottom: '3px', opacity: 0.6 }} />
              {[80,65,55].slice(0, i === 0 ? 3 : 2).map((_bw, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '2px', marginBottom: '1.5px' }}>
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#1B4F8C', flexShrink: 0 }} />
                  <div style={{ height: '2px', background: '#d1d5db', borderRadius: '1px', flex: 1 }} />
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '4px 6px 4px 4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {[0,1].map(i => (
            <div key={i}>
              <div style={{ height: '2px', background: '#1B4F8C', width: '65%', marginBottom: '2px', opacity: 0.6 }} />
              <div style={{ height: '3px', background: '#111', width: '70%', borderRadius: '1px', marginBottom: '1.5px' }} />
              <div style={{ height: '2px', background: '#93c5fd', width: '50%', borderRadius: '1px', marginBottom: '2px' }} />
              {[75,60].map((w, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: '2px', marginBottom: '1px' }}>
                  <div style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#1B4F8C', flexShrink: 0, marginTop: '1px' }} />
                  <div style={{ height: '2px', background: '#d1d5db', width: `${w}%`, borderRadius: '1px', marginTop: '1px' }} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function GreenThumbnail() {
  return (
    <div style={{ width: '100%', height: '100%', background: 'white', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(120deg, #064E3B 0%, #0E7C5A 100%)', padding: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(255,255,255,0.4)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.9)', borderRadius: '2px', width: '50%', marginBottom: '3px' }} />
          <div style={{ height: '3px', background: 'rgba(167,243,208,0.8)', borderRadius: '2px', width: '30%' }} />
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <div style={{ width: '38%', background: '#F7FAF9', borderRight: '1px solid #E8EDEB', padding: '6px 5px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {[70,55,45].map((w, i) => (
            <div key={i}>
              <div style={{ height: '2px', background: '#0E7C5A', width: `${w}%`, marginBottom: '3px', opacity: 0.6 }} />
              {[4,3].map((lvl, j) => (
                <div key={j} style={{ display: 'flex', gap: '2px', marginBottom: '2px' }}>
                  {[1,2,3,4,5].map(k => <div key={k} style={{ flex: 1, height: '2px', borderRadius: '1px', background: k <= lvl ? '#0E7C5A' : '#E8EDEB' }} />)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ flex: 1, padding: '6px 7px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ height: '2px', background: '#0E7C5A', width: '70%', marginBottom: '3px', opacity: 0.6 }} />
          {[85,65,75,50].map((w, i) => (
            <div key={i} style={{ display: 'flex', gap: '3px', alignItems: 'flex-start' }}>
              <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#0E7C5A', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: '3px', background: '#1a1a1a', width: `${w}%`, borderRadius: '1px', marginBottom: '2px' }} />
                <div style={{ height: '2px', background: '#D1FAE5', width: `${w * 0.7}%`, borderRadius: '1px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

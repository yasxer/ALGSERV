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

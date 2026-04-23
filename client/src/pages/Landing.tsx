import { useEffect, useState } from 'react'
import { LandingComponent } from '@ds/Components/landingcomponent/LandingComponent.1.0.0'
import { LandingPageLink } from '@ds/Components/landingpagelink/LandingPageLink.1.1.0'
import logoUrl from '@ds/assets/aetherlogo.svg'
import WaveCanvas from '../components/WaveCanvas'

export default function Landing() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth <= 768
  })

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768)
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <div
      data-theme="dark"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        padding: isMobile ? '48px 16px' : undefined,
        overflow: isMobile ? 'clip' : 'hidden',
        touchAction: 'none',
        boxSizing: 'border-box',
      }}
    >
      <WaveCanvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
        }}
      >
        {isMobile ? (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              background: 'transparent',
            }}
          >
            <img
              src={logoUrl}
              alt="Aether"
              style={{
                height: 32,
                width: 136,
                maxWidth: '100%',
                objectFit: 'contain',
                display: 'block',
                flexShrink: 0,
              }}
            />
            <div
              style={{
                flex: 1,
                width: '100%',
                paddingTop: 24,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxSizing: 'border-box',
              }}
            >
              <LandingPageLink
                pageLink="studios.co.uk"
                hoverMessage="coming soon"
                state="Hover"
              />
            </div>
          </div>
        ) : (
          <LandingComponent style={{ background: 'transparent' }} />
        )}
      </div>
    </div>
  )
}

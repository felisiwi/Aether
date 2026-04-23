import { LandingComponent } from '@ds/Components/landingcomponent/LandingComponent.1.0.0'
import WaveCanvas from '../components/WaveCanvas'

export default function Landing() {
  return (
    <div
      data-theme="dark"
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        overflow: 'hidden',
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
        <LandingComponent style={{ background: 'transparent' }} />
      </div>
    </div>
  )
}

import { LandingComponent } from '@ds/Components/landingcomponent/LandingComponent.1.0.0'

export default function Landing() {
  return (
    <div
      data-theme="dark"
      style={{
        width: '100vw',
        height: '100vh',
        minHeight: '100vh',
        background: 'transparent',
        boxSizing: 'border-box',
      }}
    >
      <LandingComponent style={{ background: 'transparent' }} />
    </div>
  )
}

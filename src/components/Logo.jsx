import logoSrc from '../assets/logo.png';

export default function Logo({ variant = 'light', size = 'md' }) {
  const dims = { sm: 32, md: 44, lg: 80 };
  const h = dims[size];

  if (variant === 'light') {
    // On dark purple sidebar: logo in a white pill so it reads cleanly
    return (
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center rounded-xl shrink-0 overflow-hidden"
          style={{ width: h, height: h, background: '#ffffff', padding: 4 }}
        >
          <img src={logoSrc} alt="Maho Boutique" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        {size !== 'sm' && (
          <div className="flex flex-col leading-none">
            <span
              style={{
                color: '#ffffff',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: size === 'md' ? 15 : 20,
                fontWeight: 700,
                letterSpacing: '0.01em',
              }}
            >
              Maho
            </span>
            <span
              style={{
                color: 'rgba(218,201,223,0.7)',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginTop: 2,
              }}
            >
              Boutique Admin
            </span>
          </div>
        )}
      </div>
    );
  }

  // On white/light background: show logo directly, larger
  return (
    <div className="flex flex-col items-center gap-1">
      <img src={logoSrc} alt="Maho Boutique" style={{ width: h * 1.6, height: h * 1.6, objectFit: 'contain' }} />
    </div>
  );
}

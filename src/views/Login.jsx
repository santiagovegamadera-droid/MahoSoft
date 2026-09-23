import { useState } from 'react';
import Logo from '../components/Logo';
import fondo from '../assets/public/fondo.png';
import logoSrc from '../assets/public/logo.png';

const ICONS = {
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  eyeOff: (
    <>
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <path d="m2 2 20 20" />
    </>
  ),
  heart: (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  ),
  arrowRight: (
    <>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </>
  ),
  box: (
    <>
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  chart: (
    <>
      <rect x="4" y="12" width="4" height="8" rx="1" />
      <rect x="10" y="8" width="4" height="12" rx="1" />
      <rect x="16" y="4" width="4" height="16" rx="1" />
    </>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

function Icon({ name, size = 20, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

const FEATURES = [
  { icon: 'box', label: 'Control de inventario' },
  { icon: 'users', label: 'Gestión de clientes' },
  { icon: 'chart', label: 'Reportes en tiempo real' },
  { icon: 'settings', label: 'Configuración simple' },
];

const HIGHLIGHT = '#f2c8f7';

export default function Login({ onLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [lang, setLang] = useState('ES');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div
      className="min-h-dvh lg:h-dvh lg:overflow-hidden flex bg-cover bg-center"
      style={{ backgroundImage: `url(${fondo})`, backgroundColor: '#f5f0f7' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between gap-[2vh] w-120 xl:w-140 px-14 py-[4vh] shrink-0 backdrop-blur-md"
        style={{ background: 'linear-gradient(160deg, rgba(90,58,100,0.86), rgba(58,37,65,0.9))' }}
      >
        {/* Logo + tagline */}
        <div className="flex flex-col items-center">
          <div
            className="w-[clamp(88px,17vh,160px)] aspect-square rounded-[clamp(18px,3vh,28px)] p-[1.5vh] flex items-center justify-center"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f3e6f7)',
              border: '3px solid rgba(222,184,235,0.9)',
              boxShadow: '0 0 32px rgba(230,180,245,0.45)',
            }}
          >
            <img src={logoSrc} alt="Maho Boutique" className="w-full h-full object-contain" />
          </div>
          <p
            className="mt-[2vh] text-[clamp(9px,1.3vh,11px)] font-medium tracking-[0.4em] whitespace-nowrap"
            style={{ color: 'rgba(218,201,223,0.9)' }}
          >
            MODA | ESTILO | TU ESENCIA
          </p>
        </div>

        {/* Headline + features */}
        <div>
          <h1
            className="text-[clamp(30px,5.8vh,56px)] leading-[1.05] text-white"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Gestiona tu boutique con <span style={{ color: HIGHLIGHT }}>elegancia</span> y{' '}
            <span style={{ color: HIGHLIGHT }}>precisión.</span>
          </h1>
          <p className="mt-[1.5vh] text-[clamp(14px,2vh,18px)] leading-snug text-white/90">
            Todo lo que necesitas en un solo lugar para hacer crecer tu negocio.
          </p>

          <div className="mt-[3vh] grid grid-cols-4 gap-3">
            {FEATURES.map((f) => (
              <div key={f.label} className="flex flex-col items-center text-center">
                <div
                  className="w-[clamp(44px,7vh,64px)] aspect-square rounded-full flex items-center justify-center text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.08)' }}
                >
                  <Icon name={f.icon} size={24} />
                </div>
                <p className="mt-[1vh] text-xs leading-tight text-white/85">{f.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Motto */}
        <div className="flex flex-col items-center">
          <p className="font-script text-[clamp(24px,4vh,36px)] text-white whitespace-nowrap">Sueña · Organiza · Vende · Crece</p>
          <div className="mt-1 w-32 h-px bg-white/40" />
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex-1 min-w-0 flex items-center justify-center p-4 pb-16 sm:px-8 lg:pb-[clamp(40px,7vh,64px)] lg:pt-[3vh]">
        <div
          className="relative w-full max-w-md rounded-3xl px-6 py-8 sm:px-10 lg:py-[clamp(20px,4vh,40px)]"
          style={{ background: 'rgba(255,255,255,0.95)', boxShadow: '0 12px 48px rgba(80,52,89,0.25)' }}
        >
          {/* Language selector */}
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="absolute top-[clamp(14px,3vh,24px)] right-6 text-sm font-semibold bg-transparent outline-none cursor-pointer text-brand-800"
            aria-label="Idioma"
          >
            <option value="ES">ES</option>
            <option value="EN">EN</option>
          </select>

          {/* Mobile: show logo */}
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo variant="dark" size="md" />
          </div>

          <h2
            className="flex items-center gap-3 pr-8 text-2xl sm:text-3xl text-brand-800"
            style={{ fontFamily: 'DM Serif Display, serif' }}
          >
            Bienvenida de nuevo
            <Icon name="heart" size={26} className="text-brand-400" />
          </h2>
          <p className="mt-1 mb-[clamp(12px,2.8vh,28px)] text-sm text-brand-600">Ingresa tus credenciales para continuar</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(10px,2vh,20px)]">
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                Correo electrónico
              </label>
              <div className="flex items-center gap-3 px-4 rounded-xl border border-brand-200 bg-white text-brand-800 transition-all focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-600/15">
                <Icon name="mail" size={18} className="shrink-0 text-brand-600" />
                <input
                  id="login-email"
                  type="email"
                  defaultValue="admin@mahoboutique.co"
                  className="w-full py-[clamp(8px,1.4vh,12px)] text-sm outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800">
                Contraseña
              </label>
              <div className="flex items-center gap-3 px-4 rounded-xl border border-brand-200 bg-white text-brand-800 transition-all focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-600/15">
                <Icon name="lock" size={18} className="shrink-0 text-brand-600" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  defaultValue="maho2026"
                  className="w-full py-[clamp(8px,1.4vh,12px)] text-sm outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-brand-600 hover:text-brand-800"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-brand-600">
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-800" />
                Recordarme
              </label>
              <button type="button" className="font-semibold underline underline-offset-2 text-brand-600 hover:text-brand-800">
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="mt-1 w-full py-[clamp(10px,1.6vh,14px)] rounded-xl flex items-center justify-center gap-2 text-base font-semibold text-white transition-all hover:brightness-110"
              style={{
                background: 'linear-gradient(90deg, #8a5a9b, #5e2f70)',
                boxShadow: '0 6px 20px rgba(94,47,112,0.35)',
              }}
            >
              Ingresar al sistema
              <Icon name="arrowRight" size={18} />
            </button>
          </form>

          {/* Divider */}
          <div className="my-[clamp(10px,2.5vh,24px)] flex items-center gap-2">
            <div className="flex-1 h-px bg-brand-200" />
            <div className="w-2 h-2 rounded-full border border-brand-200" />
            <div className="flex-1 h-px bg-brand-200" />
          </div>

          <p className="text-center text-sm text-brand-600">
            ¿Aún no tienes una cuenta?
            <br />
            <button type="button" className="font-semibold underline underline-offset-2 text-brand-800">
              Contáctanos
            </button>
          </p>

          {/* Quote */}
          <div className="mt-[clamp(10px,2.5vh,24px)] flex items-center justify-between gap-4 rounded-2xl px-5 py-[clamp(10px,1.8vh,16px)] bg-brand-50">
            <p className="italic text-base leading-snug text-brand-800" style={{ fontFamily: 'DM Serif Display, serif' }}>
              “Una boutique organizada,
              <br />
              siempre llega más lejos”
            </p>
            <Icon name="heart" size={26} className="shrink-0 text-brand-400" />
          </div>
        </div>

        <p className="absolute bottom-[clamp(12px,2.5vh,24px)] left-0 right-0 px-4 text-center text-[10px] sm:text-[11px] font-medium tracking-[0.15em] sm:tracking-[0.25em] text-brand-800">
          MAHO BOUTIQUE | MODA QUE TE INSPIRA | © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

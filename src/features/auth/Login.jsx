import { useState } from 'react';
import { AlertCircle, ArrowRight, Eye, EyeOff, Heart, Info, Loader2, Lock, Mail } from 'lucide-react';
import { login } from '@/features/auth/session';
import Logo from '@/shared/components/Logo';
import fondo from '@/assets/public/fondo.png';
import logoSrc from '@/assets/public/logo.png';

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  // On success the session changes and the app replaces this screen
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await login(email.trim(), password, remember);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-dvh lg:h-dvh lg:overflow-hidden flex bg-cover bg-center bg-brand-50"
      style={{ backgroundImage: `url(${fondo})` }}
    >
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between gap-[2vh] w-120 xl:w-140 px-14 py-[4vh] shrink-0 backdrop-blur-md bg-linear-160 from-brand-750/86 to-brand-900/90">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center">
          <div className="w-[clamp(88px,17vh,160px)] aspect-square rounded-[clamp(18px,3vh,28px)] p-[1.5vh] flex items-center justify-center bg-linear-145 from-white to-brand-75 border-3 border-brand-300/90 shadow-[0_0_32px_rgba(230,180,245,0.45)]">
            <img src={logoSrc} alt="Maho Boutique" className="w-full h-full object-contain" />
          </div>
          <p className="mt-[2vh] text-[clamp(9px,1.3vh,11px)] font-medium tracking-[0.4em] whitespace-nowrap text-brand-200/90">
            MODA | ESTILO | TU ESENCIA
          </p>
        </div>

        {/* Headline */}
        <div>
          <h1 className="text-[clamp(30px,5.8vh,56px)] leading-[1.05] text-white font-display">
            Gestiona tu boutique con <span className="text-orchid">elegancia</span> y{' '}
            <span className="text-orchid">precisión.</span>
          </h1>
          <p className="mt-[1.5vh] text-[clamp(14px,2vh,18px)] leading-snug text-white/90">
            Todo lo que necesitas en un solo lugar para hacer crecer tu negocio.
          </p>
        </div>

        {/* Motto */}
        <div className="flex flex-col items-center">
          <p className="font-script text-[clamp(24px,4vh,36px)] text-white whitespace-nowrap">
            Sueña · Organiza · Vende · Crece
          </p>
          <div className="mt-1 w-32 h-px bg-white/40" />
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex-1 min-w-0 flex items-center justify-center p-4 pb-16 sm:px-8 lg:pb-[clamp(40px,7vh,64px)] lg:pt-[3vh]">
        <div className="relative w-full max-w-md rounded-3xl px-6 py-8 sm:px-10 lg:py-[clamp(20px,4vh,40px)] bg-white/95 shadow-[0_12px_48px_rgba(80,52,89,0.25)]">
          {/* Mobile: show logo */}
          <div className="lg:hidden mb-6 flex justify-center">
            <Logo variant="dark" size="md" />
          </div>

          <h2 className="flex items-center gap-3text-2xl sm:text-3xl text-brand-800 font-display">
            Bienvenida de nuevo
            <Heart size={26} strokeWidth={1.75} className="text-brand-400" />
          </h2>
          <p className="mt-1 mb-[clamp(12px,2.8vh,28px)] text-sm text-brand-600">
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-[clamp(10px,2vh,20px)]">
            <div>
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800"
              >
                Correo electrónico
              </label>
              <div className="flex items-center gap-3 px-4 rounded-xl border border-brand-200 bg-white text-brand-800 transition-all focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-600/15">
                <Mail size={18} strokeWidth={1.75} className="shrink-0 text-brand-600" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="username"
                  placeholder="tu@correo.com"
                  required
                  autoFocus
                  className="w-full py-[clamp(8px,1.4vh,12px)] text-sm outline-none bg-transparent"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide text-brand-800"
              >
                Contraseña
              </label>
              <div className="flex items-center gap-3 px-4 rounded-xl border border-brand-200 bg-white text-brand-800 transition-all focus-within:border-brand-600 focus-within:ring-3 focus-within:ring-brand-600/15">
                <Lock size={18} strokeWidth={1.75} className="shrink-0 text-brand-600" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                  className="w-full py-[clamp(8px,1.4vh,12px)] text-sm outline-none bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="shrink-0 text-brand-600 hover:text-brand-800"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.75} /> : <Eye size={18} strokeWidth={1.75} />}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-brand-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 accent-brand-800"
                />
                Recordarme
              </label>
              <button
                type="button"
                onClick={() => {
                  setError('');
                  setInfo('Pídele a la administradora que te asigne una contraseña nueva desde Usuarios.');
                }}
                className="font-semibold underline underline-offset-2 text-brand-600 hover:text-brand-800"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {error && (
              <p
                role="alert"
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm bg-danger-soft text-danger"
              >
                <AlertCircle size={17} className="shrink-0 mt-px" />
                {error}
              </p>
            )}
            {info && (
              <p className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-sm bg-brand-50 text-brand-800">
                <Info size={17} className="shrink-0 mt-px text-brand-600" />
                {info}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full disabled:opacity-70 disabled:cursor-wait py-[clamp(10px,1.6vh,14px)] rounded-xl flex items-center justify-center gap-2 text-base font-semibold text-white transition-all hover:brightness-110 bg-linear-90 from-brand-500 to-brand-700 shadow-[0_6px_20px_rgba(94,47,112,0.35)]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} strokeWidth={1.75} className="animate-spin" /> Ingresando…
                </>
              ) : (
                <>
                  Ingresar al sistema
                  <ArrowRight size={18} strokeWidth={1.75} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="absolute bottom-[clamp(12px,2.5vh,24px)] left-0 right-0 px-4 text-center text-[10px] sm:text-[11px] font-medium tracking-[0.15em] sm:tracking-[0.25em] text-brand-800">
          MAHO BOUTIQUE | MODA QUE TE INSPIRA | © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

import Logo from '../components/Logo';
import fondo from '../assets/public/fondo.png';

export default function Login({ onLogin }) {
  function handleSubmit(e) {
    e.preventDefault();
    onLogin();
  }

  return (
    <div
      className="min-h-screen flex bg-cover bg-center"
      style={{ backgroundImage: `url(${fondo})`, backgroundColor: '#f5f0f7' }}
    >
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[440px] p-12 shrink-0 backdrop-blur-md"
        style={{ background: 'rgba(80,52,89,0.82)' }}
      >
        {/* Logo prominently at top */}
        <div className="flex flex-col items-center">
          <div
            className="w-36 h-36 rounded-2xl flex items-center justify-center mb-2"
            style={{ background: 'rgba(255,255,255,0.95)', padding: 12 }}
          >
            <Logo variant="dark" size="lg" />
          </div>
        </div>

        <div>
          <p
            className="text-4xl leading-tight mb-4"
            style={{ fontFamily: 'DM Serif Display, serif', color: '#ffffff' }}
          >
            Gestiona tu boutique con elegancia y precisión.
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div
          className="w-full max-w-sm rounded-3xl p-8 backdrop-blur-md"
          style={{ background: 'rgba(255,255,255,0.88)', boxShadow: '0 8px 40px rgba(80,52,89,0.25)' }}
        >
          {/* Mobile: show logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <div
              className="w-28 h-28 rounded-2xl flex items-center justify-center"
              style={{ background: '#fff', padding: 8, boxShadow: '0 4px 24px rgba(80,52,89,0.12)' }}
            >
              <Logo variant="dark" size="lg" />
            </div>
          </div>

          <h2
            className="text-2xl font-semibold mb-1"
            style={{ color: '#503459', fontFamily: 'DM Serif Display, serif' }}
          >
            Bienvenida de nuevo
          </h2>
          <p className="text-sm mb-8" style={{ color: '#81638b' }}>
            Ingresa tus credenciales para continuar
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: '#503459' }}
              >
                Correo electrónico
              </label>
              <input
                type="email"
                defaultValue="admin@mahoboutique.co"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: '#dac9df', background: '#fff', color: '#503459' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#81638b';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,99,139,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#dac9df';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
            <div>
              <label
                className="block text-xs font-semibold mb-1.5 uppercase tracking-wide"
                style={{ color: '#503459' }}
              >
                Contraseña
              </label>
              <input
                type="password"
                defaultValue="••••••••"
                className="w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all"
                style={{ borderColor: '#dac9df', background: '#fff', color: '#503459' }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#81638b';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(129,99,139,0.15)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#dac9df';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer" style={{ color: '#81638b' }}>
                <input type="checkbox" defaultChecked className="accent-[#81638b]" />
                Recordarme
              </label>
              <button type="button" className="font-semibold" style={{ color: '#81638b' }}>
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all mt-2"
              style={{ background: '#81638b' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#503459')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#81638b')}
            >
              Ingresar al sistema
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

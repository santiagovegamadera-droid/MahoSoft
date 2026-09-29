import logoSrc from '@/assets/public/logo.png';

const boxSizes = { sm: 'size-8', md: 'size-11', lg: 'size-20' };
// Standalone logo is 1.6x the box size
const imageSizes = { sm: 'size-[51px]', md: 'size-[70px]', lg: 'size-32' };

export default function Logo({ variant = 'light', size = 'md' }) {
  if (variant === 'light') {
    // On dark purple sidebar: logo in a white pill so it reads cleanly
    return (
      <div className="flex items-center gap-2.5">
        <div
          className={`flex items-center justify-center rounded-xl shrink-0 overflow-hidden bg-white p-1 ${boxSizes[size]}`}
        >
          <img src={logoSrc} alt="Maho Boutique" className="size-full object-contain" />
        </div>
        {size !== 'sm' && (
          <div className="flex flex-col leading-none">
            <span
              className={`text-white font-sans font-bold tracking-[0.01em] ${
                size === 'md' ? 'text-[15px]' : 'text-xl'
              }`}
            >
              Maho
            </span>
            <span className="mt-0.5 text-brand-200/70 font-sans text-[9px] font-semibold tracking-[0.14em] uppercase">
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
      <img src={logoSrc} alt="Maho Boutique" className={`object-contain ${imageSizes[size]}`} />
    </div>
  );
}

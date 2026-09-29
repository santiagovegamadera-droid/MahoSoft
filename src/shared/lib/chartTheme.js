// Recharts needs literal color values, so read them from the @theme tokens in index.css
const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(`--color-${name}`).trim();

/** Colors and shared styles for charts; call it while rendering, once the stylesheet is loaded */
export default function chartTheme() {
  const c = {
    primary: token('brand-600'),
    dark: token('brand-800'),
    muted: token('brand-400'),
    label: token('subtle'),
    soft: token('brand-200'),
    line: token('brand-150'),
    grid: token('brand-100'),
  };
  return {
    ...c,
    series: [c.dark, c.primary, c.muted, c.soft, c.line],
    tick: { fontSize: 12, fill: c.label },
    tooltip: {
      fontSize: 12,
      borderRadius: 10,
      border: `1px solid ${c.line}`,
      color: c.dark,
    },
  };
}

/**
 * SectionHeader — reusable label + heading pattern used across sections.
 *
 * @param {string} label - Small uppercase label text (e.g., "INNOVATIVE CARE")
 * @param {boolean} centered - Whether to center-align (default: false)
 * @param {string} className - Additional wrapper classes
 * @param {React.ReactNode} children - The h2 heading content
 */
export default function SectionHeader({ label, centered = false, className = '', children }) {
  return (
    <div className={`flex flex-col ${centered ? 'text-center' : ''} ${className}`}>
      {label && (
        <span className="font-syne text-[10px] tracking-[0.25em] text-text-muted uppercase mb-2">
          {label}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl font-light text-text-primary tracking-wide transition-colors duration-500">
        {children}
      </h2>
    </div>
  );
}

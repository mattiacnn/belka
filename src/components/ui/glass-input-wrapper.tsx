interface GlassInputWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassInputWrapper = ({ children, className = '' }: GlassInputWrapperProps) => (
  <div className={`rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10 ${className}`}>
    {children}
  </div>
); 
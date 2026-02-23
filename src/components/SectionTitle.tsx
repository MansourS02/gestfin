interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  light?: boolean;
  center?: boolean;
}

const SectionTitle = ({ subtitle, title, description, light, center = true }: SectionTitleProps) => {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""} mb-12`}>
      {subtitle && (
        <span className={`text-sm font-semibold uppercase tracking-widest ${light ? "text-secondary" : "text-secondary"}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`font-display text-3xl md:text-4xl font-bold mt-2 ${light ? "text-primary-foreground" : "text-foreground"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-lg leading-relaxed ${light ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  gradientWord?: string;
  align?: 'left' | 'center';
}

export default function SectionHeading({ title, subtitle, gradientWord, align = 'left' }: SectionHeadingProps) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start';

  return (
    <div className={`flex flex-col ${alignment} mb-10`}>
      <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[#0B132B] dark:text-[#F9E79F]">
        {title}{' '}
        {gradientWord && (
          <span className="gradient-brand bg-clip-text text-transparent">{gradientWord}</span>
        )}
      </h2>
      {subtitle && (
        <p className="mt-4 text-[#1E3A5F] dark:text-[#8496B8] max-w-2xl text-base sm:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

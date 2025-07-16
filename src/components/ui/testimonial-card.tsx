export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  delay?: string;
}

export const TestimonialCard = ({ testimonial, delay = '' }: TestimonialCardProps) => (
  <div className={`animate-testimonial ${delay} testimonial-card flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 dark:border-zinc-700/50 p-5 w-64`}>
    <img 
      src={testimonial.avatarSrc} 
      className="h-10 w-10 aspect-square object-cover rounded-full flex-shrink-0" 
      alt="avatar" 
    />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium text-card-foreground">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-card-foreground/90">{testimonial.text}</p>
    </div>
  </div>
); 
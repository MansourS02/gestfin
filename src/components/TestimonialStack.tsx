import { useRef, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  status?: string;
}

interface TestimonialStackProps {
  testimonials: Testimonial[];
}

const VISIBLE_BEHIND = 2; // how many cards peek behind the top card

const TestimonialStack = ({ testimonials }: TestimonialStackProps) => {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);

  const count = testimonials.length;

  const goNext = () => setIndex((i) => (i + 1) % count);
  const goPrev = () => setIndex((i) => (i - 1 + count) % count);

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    startX.current = e.clientX;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return;
    setDragX(e.clientX - startX.current);
  };

  const endDrag = () => {
    if (!dragging) return;
    const threshold = 80;
    if (dragX < -threshold) {
      goNext();
    } else if (dragX > threshold) {
      goPrev();
    }
    setDragging(false);
    setDragX(0);
  };

  const getOffsetIndex = (cardPos: number) => (index + cardPos) % count;

  return (
    <div className="relative max-w-xl mx-auto">
      <div
        className="relative h-[340px] sm:h-[300px] select-none touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {[...Array(Math.min(VISIBLE_BEHIND + 1, count))]
          .map((_, pos) => VISIBLE_BEHIND - pos)
          .map((pos) => {
            const t = testimonials[getOffsetIndex(pos)];
            const isTop = pos === 0;
            const scale = 1 - pos * 0.04;
            const translateY = pos * 14;
            const rotate = isTop && dragging ? dragX / 18 : 0;
            const translateX = isTop && dragging ? dragX : 0;
            const opacity = isTop ? 1 - Math.min(Math.abs(dragX) / 400, 0.5) : 1 - pos * 0.18;

            return (
              <div
                key={getOffsetIndex(pos)}
                className="absolute inset-0 bg-card rounded-xl p-6 sm:p-8 border border-border shadow-lg cursor-grab active:cursor-grabbing"
                style={{
                  transform: `translate(${translateX}px, ${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
                  zIndex: VISIBLE_BEHIND - pos + 1,
                  opacity,
                  transition: dragging && isTop ? "none" : "transform 0.3s ease, opacity 0.3s ease",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="w-4 h-4 fill-gold text-gold" />
                    ))}
                  </div>
                  {t.status && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-accent/10 text-accent">
                      {t.status}
                    </span>
                  )}
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6 italic line-clamp-6">
                  "{t.text}"
                </p>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-sm text-muted-foreground">{t.role}</div>
                </div>
              </div>
            );
          })}
      </div>

      {count > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={goPrev}
            aria-label="Témoignage précédent"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                aria-label={`Aller au témoignage ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i === index ? "bg-accent" : "bg-border"
                }`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            aria-label="Témoignage suivant"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-border hover:bg-muted transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default TestimonialStack;

type Testimonial = {
  image: string;
  name: string;
  role: string;
  quote: string;
};

type TestimonialsSectionProps = {
  testimonials: Testimonial[];
};

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials.length) return null;

  return (
    <section className="bg-[#ECECEC] px-3 pb-6 pt-0 sm:px-5 sm:pb-8">
      <div className="relative mx-auto w-full max-w-[1394px] border border-[#D6D6D6] bg-[#ECECEC] px-6 py-8 sm:px-8 sm:py-9">
        <h2 className="text-[34px] font-medium leading-none text-black">Testimonials</h2>

        <button
          type="button"
          className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#dbe7f5] text-2xl leading-none text-[#6f7f90]"
          aria-label="Previous testimonials"
        >
          ‹
        </button>
        <button
          type="button"
          className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#dbe7f5] text-2xl leading-none text-[#6f7f90]"
          aria-label="Next testimonials"
        >
          ›
        </button>

        <div className="mt-5 overflow-x-auto">
          <div className="flex min-w-max gap-8 pr-6">
            {testimonials.map((t, idx) => (
              <article key={`${t.name}-${idx}`} className="w-[220px]">
                <img src={t.image} alt="" className="h-[160px] w-[160px] rounded-full object-cover object-center" />
                <h3 className="mt-4 text-[34px] font-medium leading-none text-black">
                  {t.name}
                </h3>
                <p className="mt-3 text-[14px] font-normal text-[#8A8A8A]">{t.role}</p>
                <p className="mt-4 text-[12px] leading-[1.7] text-black">{t.quote}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

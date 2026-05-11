const testimonials = [
  { id: 't1', name: 'Ari', quote: 'Cart + checkout flow is smooth even with this wild UI.' },
  { id: 't2', name: 'Nox', quote: 'Profile and orders still work exactly as expected.' },
  { id: 't3', name: 'Kai', quote: 'This theme proves UI can change without touching runtime logic.' },
];

export const GamingTestimonialsSection = () => {
  return (
    <section style={{ padding: '20px', background: '#0d1117', color: '#e5e7eb' }}>
      <h2 style={{ marginTop: 0 }}>Player Reviews</h2>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {testimonials.map((item) => (
          <article key={item.id} style={{ border: '1px solid #263244', padding: 12, background: '#111827' }}>
            <p style={{ marginTop: 0 }}>{item.quote}</p>
            <p style={{ marginBottom: 0, color: '#7cf7b1' }}>- {item.name}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

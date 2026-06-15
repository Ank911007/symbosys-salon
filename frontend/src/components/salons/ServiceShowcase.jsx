import React from 'react';
import ServiceBlock from './ServiceBlock';

const servicesData = [
  {
    title: 'HAIR CUTS & HAIRSTYLES',
    description: 'Our expert hair artists use top-notch techniques to create a personalized style that complements your features. From classic cuts to the latest trends, we make sure you leave looking and feeling your absolute best.',
    image: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=1200',
    align: 'left'
  },
  {
    title: 'SKIN & FACIAL CARE',
    description: 'Indulge in our rejuvenating skin treatments designed to restore your natural glow. We offer customized facials, deep cleansing, and anti-aging therapies that leave your skin feeling refreshed and deeply nourished.',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&q=80&w=1200',
    align: 'right'
  },
  {
    title: 'HAIR COLORING & TREATMENT',
    description: 'Transform your look with our premium hair coloring services. Whether you want subtle balayage, bold vibrant tones, or restorative keratin treatments, our color specialists deliver flawless, long-lasting results.',
    image: 'https://images.unsplash.com/photo-1600948836101-f9ff09c1f609?auto=format&fit=crop&q=80&w=1200',
    align: 'left'
  },
  {
    title: 'NAIL CARE & ART',
    description: 'Treat your hands and feet to our luxurious manicures and pedicures. Choose from classic polish, durable gels, or intricate nail art designed by our talented technicians for the perfect finishing touch.',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&q=80&w=1200',
    align: 'right'
  }
];

export default function ServiceShowcase() {
  return (
    <section className="w-full bg-[#FDFBF7] py-24 lg:py-32 overflow-hidden transition-colors duration-300">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col gap-32 md:gap-40">
        {servicesData.map((service, index) => (
          <ServiceBlock 
            key={index}
            {...service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

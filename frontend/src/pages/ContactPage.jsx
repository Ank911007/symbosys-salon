import React, { useState } from 'react';
import Navbar from '../Navbar';
import { SimpleFooter } from '../components/sections/SimpleFooter';
import { Input } from '../components/ui/Input';
import { PhoneInput } from '../components/ui/PhoneInput';
import { TextArea } from '../components/ui/TextArea';
import { MapPin, Phone, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useSubmitContact } from '../hooks/useMutations';
import { toast } from 'sonner';

export default function ContactPage() {
  const { mutate: submitContact, isPending: isSubmitting } = useSubmitContact();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitContact(formData, {
      onSuccess: () => {
        setFormData({ name: '', email: '', subject: '', message: '' });
        toast.success('Message Sent', {
          description: 'Thank you for reaching out. We will get back to you shortly.',
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col font-syne text-primary-text transition-colors duration-300">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center mt-20">
        <div className="absolute inset-0 bg-black/40 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=2000" 
          alt="Salon Interior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <h1 className="relative z-20 font-serif text-4xl md:text-5xl lg:text-6xl text-white font-bold tracking-tight">
          Contact Us
        </h1>
      </div>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col gap-16 lg:gap-24 relative z-10">
        
        {/* Top 3 Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Address Card */}
          <a 
            href="https://www.google.com/maps/dir/?api=1&destination=Harmu,+Ranchi,+Jharkhand,+India"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white p-8 rounded-3xl border border-[#d8eedd] shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full border border-[#4a9e5c] text-[#4a9e5c] flex items-center justify-center mb-6">
              <MapPin size={24} />
            </div>
            <h3 className="font-serif text-2xl text-[#1a3d1f] font-bold mb-3">Address</h3>
            <p className="text-[#5a8c63] text-sm leading-relaxed max-w-xs">
              Harmu, Ranchi<br/>Jharkhand, India
            </p>
          </a>

          {/* Email Card */}
          <a 
            href="mailto:hello@mintasalon.com"
            className="bg-white p-8 rounded-3xl border border-[#d8eedd] shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full border border-[#4a9e5c] text-[#4a9e5c] flex items-center justify-center mb-6">
              <Mail size={24} />
            </div>
            <h3 className="font-serif text-2xl text-[#1a3d1f] font-bold mb-3">Email Address</h3>
            <p className="text-[#5a8c63] text-sm leading-relaxed">
              hello@mintasalon.com
            </p>
          </a>

          {/* Phone Card */}
          <a 
            href="tel:+919122010150"
            className="bg-white p-8 rounded-3xl border border-[#d8eedd] shadow-sm flex flex-col items-center text-center hover:-translate-y-1 transition-transform cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full border border-[#4a9e5c] text-[#4a9e5c] flex items-center justify-center mb-6">
              <Phone size={24} />
            </div>
            <h3 className="font-serif text-2xl text-[#1a3d1f] font-bold mb-3">Phone</h3>
            <p className="text-[#5a8c63] text-sm leading-relaxed">
              +91 9122010150
            </p>
          </a>

        </div>

        {/* Bottom Section: Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          
          {/* Contact Form Container */}
          <div className="bg-surface rounded-3xl p-8 lg:p-12 shadow-sm border border-border relative overflow-hidden transition-colors duration-300">
            
            <h2 className="font-serif text-3xl text-primary-text font-bold mb-8 transition-colors duration-300">Send a Message</h2>
            <p className="text-[#5a8c63] text-base mb-10 leading-relaxed max-w-md">
              Whether you have a question about our services, need to book an extended session, or simply want to say hello—we are here for you.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  name="name"
                  placeholder="Enter Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
                <Input 
                  name="email"
                  type="email" 
                  placeholder="Enter Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PhoneInput 
                  name="phone"
                  value={formData.phone || ''}
                  onChange={(val) => setFormData(prev => ({ ...prev, phone: val }))}
                  required 
                />
                <Input 
                  name="subject"
                  placeholder="Enter Subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  required 
                />
              </div>

              <TextArea 
                name="message"
                placeholder="Message" 
                value={formData.message}
                onChange={handleChange}
                required 
              />

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-2 w-full md:w-auto md:self-start flex items-center justify-center bg-[#4bd5c8] text-white px-10 py-4 rounded font-syne font-semibold hover:bg-[#3bbab1] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          {/* Right Column: Google Map */}
          <div className="w-full h-[500px] lg:h-auto min-h-[400px] rounded-2xl overflow-hidden shadow-sm border border-[#d8eedd]">
             <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117223.77906806734!2d85.23932230491873!3d23.34320478144208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e104aa5db7dd%3A0xdc09d49d6899f43e!2sRanchi%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1701161245678!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>

        </div>

      </main>

      <SimpleFooter />
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';

export function SimpleFooter() {
  return (
    <footer className="bg-[#e8f5ea] border-t border-[#d8eedd] py-8 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-syne font-bold text-[#5a8c63]">
        <div>
          <span className="text-[#1a3d1f]">Minta Salon</span><br/>
          <span className="font-normal">© 2024 Minta Salon. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-[#1a3d1f]">Privacy Policy</a>
          <a href="#" className="hover:text-[#1a3d1f]">Terms of Service</a>
          <a href="#" className="hover:text-[#1a3d1f]">Support</a>
          <Link to="/about" className="hover:text-[#1a3d1f]">About Us</Link>
          <Link to="/contact" className="hover:text-[#1a3d1f]">Contact Us</Link>
        </div>
      </div>
    </footer>
  );
}

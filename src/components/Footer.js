import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 mt-20">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              <span className="text-white">CHEAP</span>
              <span className="text-[#B50000]">GAMES39</span>
            </h3>
            <p className="text-gray-400 text-sm">Your one-stop shop for affordable PC games. Get the best deals on the latest titles.</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/games" className="text-gray-400 hover:text-white text-sm transition-colors" data-testid="footer-games-link">Browse Games</Link></li>
              <li><Link to="/offers" className="text-gray-400 hover:text-white text-sm transition-colors" data-testid="footer-offers-link">Offers & Giveaway</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white text-sm transition-colors" data-testid="footer-contact-link">Contact Us</Link></li>
            </ul>
          </div>

      <ul className="space-y-2">

  <li>
    <Link
      to="/privacy"
      className="text-gray-400 hover:text-white text-sm transition-colors"
    >
      Privacy Policy
    </Link>
  </li>

  <li>
    <Link
      to="/terms"
      className="text-gray-400 hover:text-white text-sm transition-colors"
    >
      Terms & Conditions
    </Link>
  </li>

  <li>
    <Link
      to="/faq"
      className="text-gray-400 hover:text-white text-sm transition-colors"
    >
      FAQ
    </Link>
  </li>

</ul>

          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="https://instagram.com/cheapgames39_official" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B50000] transition-colors" data-testid="footer-instagram-link">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="https://wa.me/919659868303" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-[#B50000] transition-colors" data-testid="footer-whatsapp-link">
                <Phone className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">&copy; 2026 CheapGames39. All rights reserved.</p>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://chat.whatsapp.com/FQfpsiwYv1pLqWScaIFc69"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all z-50"
        data-testid="whatsapp-floating-button"
      >
        <Phone className="w-6 h-6" />
      </a>
    </footer>
  );
};
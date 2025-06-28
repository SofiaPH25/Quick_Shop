
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-dark text-neutral-light py-8 mt-auto">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {new Date().getFullYear()} E-commerce QuickShop. All rights reserved.</p>
        <p className="text-sm mt-2">A modern shopping experience, built with React & Tailwind CSS.</p>
        {/* Technical Research Note: Legal links (Privacy Policy, Terms of Service) would go here. */}
      </div>
    </footer>
  );
};

export default Footer;
    
import React from 'react';
import SectionDivider from './SectionDivider';

export default function Footer() {
  return (
    <footer className="section-footer relative overflow-visible bg-black text-center">
      <SectionDivider className="section-boundary-divider section-boundary-divider--top absolute inset-x-0 top-0 z-20 w-full" />

      <div className="relative z-10">
        <p className="mb-6 font-display text-section lowercase text-white">
          dhreian
        </p>

        <a
          href="mailto:contact@dhreian.com"
          className="font-body text-zinc-400 hover:text-purple-300 transition-colors duration-300 text-body-compact tracking-wide"
        >
          contact@dhreian.com
        </a>

        <p className="text-zinc-600 text-meta mt-7">
          &copy; {new Date().getFullYear()} dhreian.
        </p>
      </div>
    </footer>
  );
}

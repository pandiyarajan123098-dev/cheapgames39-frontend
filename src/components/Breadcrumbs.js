import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ paths = [] }) => {
  return (
    <nav className="flex items-center flex-wrap gap-1.5 text-[11px] font-semibold text-[#666666] mb-6 select-none uppercase tracking-wider">
      <Link to="/" className="hover:text-[#B50000] transition flex items-center shrink-0">
        <span>Home</span>
      </Link>
      {paths.map((p, idx) => {
        const isLast = idx === paths.length - 1;
        return (
          <React.Fragment key={idx}>
            <ChevronRight className="w-3 h-3 text-[#999999]" />
            {isLast ? (
              <span className="text-[#222222] font-bold truncate max-w-[150px] md:max-w-none">
                {p.label}
              </span>
            ) : (
              <Link to={p.path} className="hover:text-[#B50000] transition shrink-0">
                {p.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;

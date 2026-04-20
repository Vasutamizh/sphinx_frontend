function Footer() {
  return (
    <footer className="bg-[#F1EFE8] border-t border-[#D3D1C7] px-6 py-8 mt-10">
      <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Footer Brand */}
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <span className="text-[15px] font-bold tracking-tight text-[#2C2C2A] font-serif">
            Sphinx<span className="text-[#0F6E56]">Exam</span>
          </span>
        </a>

        {/* Footer Links */}
        <div className="flex flex-wrap gap-5">
          {["Help & Support"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] text-[#888780] hover:text-[#1D9E75] no-underline transition-colors duration-150"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="w-full border-t border-[#D3D1C7] pt-4 mt-1 text-center">
          <p className="text-xs text-[#888780]">
            {new Date().getFullYear()} SphinxExam. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

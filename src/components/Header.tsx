const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background border-b px-4 py-3 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-extrabold tracking-tight leading-none">ইফতার ফাইন্ডার</h1>
        <p className="text-xs text-muted-foreground">Iftaar Finder – Chittagong</p>
      </div>
      <span className="pill-badge text-[10px]">Ramadan 2026</span>
    </header>
  );
};

export default Header;

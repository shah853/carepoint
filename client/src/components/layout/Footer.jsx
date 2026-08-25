function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200 bg-white px-4 py-7 text-center text-sm text-slate-600">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <span className="font-semibold text-slate-800">CarePoint</span>
        <img
          src="/founder-muhammad-shah.jpg"
          alt="Muhammad Shah"
          className="h-7 w-7 rounded-full object-cover sm:h-9 sm:w-9"
        />
        <span className="text-xs font-medium text-gray-700 sm:text-sm">
          Muhammad Shah
        </span>
      </div>
      <p className="mt-3 text-xs text-slate-500">© {new Date().getFullYear()} CarePoint. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
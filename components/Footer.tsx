export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="border-t border-white/40 bg-white/30 backdrop-blur-lg py-4 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-pink-900/70">
        <p>&copy; {currentYear} The MNH. All rights reserved.</p>
      </div>
    </footer>
  );
}

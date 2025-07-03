const Footer = () => (
<footer className="bg-black text-gray-400 px-6 py-10 mt-20">
  <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm">
    <div>
      <h4 className="text-white font-semibold mb-3">Browse</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">Movies</a></li>
        <li><a href="#" className="hover:underline">TV Shows</a></li>
        <li><a href="#" className="hover:underline">New & Popular</a></li>
      </ul>
    </div>

    <div>
      <h4 className="text-white font-semibold mb-3">Company</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">About</a></li>
        <li><a href="#" className="hover:underline">Careers</a></li>
        <li><a href="#" className="hover:underline">Help Center</a></li>
        <li><a href="#" className="hover:underline">Contact Us</a></li>
      </ul>
    </div>

    <div>
      <h4 className="text-white font-semibold mb-3">Legal</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Terms of Use</a></li>
        <li><a href="#" className="hover:underline">Privacy Policy</a></li>
        <li><a href="#" className="hover:underline">Cookie Preferences</a></li>
      </ul>
    </div>

    <div>
      <h4 className="text-white font-semibold mb-3">Follow Us</h4>
      <ul className="space-y-2">
        <li><a href="#" className="hover:underline">Facebook</a></li>
        <li><a href="#" className="hover:underline">Instagram</a></li>
        <li><a href="#" className="hover:underline">Twitter</a></li>
        <li><a href="#" className="hover:underline">YouTube</a></li>
      </ul>
    </div>
  </div>

  <div className="text-center text-xs text-gray-500 mt-8">
    © {new Date().getFullYear()} WATCH ME. All rights reserved.
  </div>
</footer>

);


export default Footer;

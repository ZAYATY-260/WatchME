
const Topbar = () => (
  <header className="fixed top-0 left-0 right-0 flex justify-between items-center px-6 py-4 bg-transparent text-white z-50">



    <div className="flex items-center space-x-8">
      {/* Logo - always visible */}
      <h1 className="text-3xl font-bold text-red-600 tracking-wider">WATCH ME</h1>

      {/* Nav Links - hidden on small screens */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
        <a href="#" className="hover:text-gray-300 transition ">Home</a>
        <a href="#" className="hover:text-gray-300 transition">Movies</a>
        <a href="#" className="hover:text-gray-300 transition">TV Shows</a>
        <a href="#" className="hover:text-gray-300 transition">My List</a>
      </nav>
    </div>



    <div className="flex items-center space-x-4 ">
      <img
        src="https://media.licdn.com/dms/image/v2/D4D35AQEJ-pIca5IaQw/profile-framedphoto-shrink_400_400/B4DZfLFZsMH4Ac-/0/1751458880757?e=1752102000&v=beta&t=jCBNqRysQcB0sEaLH3GoZwk6HqLImVYYS2qF9XDanfQ"
        alt="Profile"
        className="w-8 h-8 rounded-full object-cover border border-gray-500"
      />
    </div>
  </header>
);


export default Topbar;

function NavigationBar() {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo or Brand */}
        <div className="text-white font-bold text-xl">Your Logo</div>

        {/* Navigation Links */}
        <div className="space-x-4">
          <a href="/login" className="text-white hover:text-gray-300">Sign In</a>
          <a href="/register" className="text-white hover:text-gray-300">Sign Up</a>
        </div>
      </div>
    </nav>
  );
}

export default NavigationBar;

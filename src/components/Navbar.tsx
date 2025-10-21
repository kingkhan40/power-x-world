import Link from "next/link";
import Image from "next/image";
import { xLogo } from "../assets";

interface NavLink {
  name: string;
  href: string;
}

const Navbar = () => {
  const navLinks: NavLink[] = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav className="shadow-lg relative overflow-hidden">
        <div className="max-w-7xl mx-auto lg:px-4 px-0 py-2 relative z-10">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <div className="flex items-center gap-1 text-black">
              <Link href="/" className="flex items-center gap-2">
                <Image 
                  src={xLogo}
                  alt="Logo" 
                  width={40} 
                  height={40}
                  className="lg:w-60 w-40 lg:h-20 h-16 object-cover"
                />
              </Link>
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-900 hover:text-blue-400 transition-colors duration-200 font-medium py-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
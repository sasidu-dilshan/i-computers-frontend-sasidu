import { PiShoppingCartSimpleLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import UserData from "./userData";
import { CiBoxList, CiHome, CiPhone, CiShoppingCart } from "react-icons/ci";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 w-full h-[88px] bg-accent/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,128,0.2)] flex px-6 lg:px-12 items-center justify-center lg:justify-between transition-all">
        
        <Link to="/" className="h-12 flex items-center group transition-transform duration-300 hover:scale-105">
          <img
            src="/logo-white.png"
            referrerPolicy="no-referrer"
            alt="Logo"
            className="h-full object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.3)]"
          />
        </Link>

        <nav className="h-full text-primary hidden lg:flex items-center gap-2">
          {[
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: "About", path: "/about" },
          ].map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="relative h-full flex items-center px-5 font-medium tracking-wide text-primary/90 hover:text-white transition-colors duration-300 group"
            >
              <span>{item.name}</span>

              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-primary rounded-t-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
            </Link>
          ))}
        </nav>

        <div className="h-full hidden lg:flex items-center justify-end gap-6">
          <Link
            to="/cart"
            className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group shadow-sm hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <PiShoppingCartSimpleLight className="text-white text-2xl transition-transform group-hover:scale-110" />
          </Link>
          
          <div className="pl-2 border-l border-white/15">
            <UserData />
          </div>
        </div>
      </header>

      <div className="fixed bottom-3 left-1/2 -translate-x-1/2 flex lg:hidden w-[92%] max-w-[430px] h-[72px] z-50 bg-white/90 backdrop-blur-xl border border-accent/20 shadow-[0_10px_30px_rgba(0,0,128,0.15)] rounded-2xl justify-between items-center px-2">
        <Link
          className="flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-xl text-accent hover:bg-accent/5 transition-all"
          to="/"
        >
          <CiHome className="text-2xl stroke-[0.5]" />
          <span className="text-[11px] font-semibold tracking-wider">Home</span>
        </Link>

        <Link
          className="flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-xl text-accent hover:bg-accent/5 transition-all"
          to="/products"
        >
          <CiBoxList className="text-2xl stroke-[0.5]" />
          <span className="text-[11px] font-semibold tracking-wider">Products</span>
        </Link>

        <Link
          className="flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-xl text-accent hover:bg-accent/5 transition-all"
          to="/about"
        >
          <CiPhone className="text-2xl stroke-[0.5]" />
          <span className="text-[11px] font-semibold tracking-wider">About</span>
        </Link>

        <Link
          className="flex-1 h-full flex flex-col items-center justify-center gap-1 rounded-xl text-accent hover:bg-accent/5 transition-all"
          to="/cart"
        >
          <CiShoppingCart className="text-2xl stroke-[0.5]" />
          <span className="text-[11px] font-semibold tracking-wider">Cart</span>
        </Link>

        <div className="flex-1 h-full flex items-center justify-center">
          <UserData />
        </div>
      </div>
    </>
  );
}
import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GlobalContext } from "../App";
import { useCompany } from "../contexts/CompanyContext";
import { useAuth } from "../contexts/AuthContext";
import UserDropdown from "./UserDropdown";

function NavbarLink({ href, onClick, children }) {
  return (
    <NavLink
      to={href}
      onClick={onClick}
      className="block py-3 px-4 min-w-[80px] text-center rounded-md transition-all duration-300 hover:bg-gray-100 hover:text-primary"
    >
      {children}
    </NavLink>
  );
}

export default function Navbar() {
  const { theme } = useContext(GlobalContext);
  const { handleLogout, isLogged } = useAuth();
  const { logo, authMenu, menu } = useCompany();
  const navigate = useNavigate();

  return (
    <header
      className={
        "sticky top-0 z-50  backdrop-blur-sm shadow-lg " +
        (theme === "light" ? "bg-white/70" : "bg-gray-900/70")
      }
    >
      <nav className="py-4">
        <div className="container px-4 mx-auto flex items-center justify-between">
          <div>
            <img src={logo.urlLogoNav} alt={logo.alt} className="h-11" />
          </div>

          <div>
            <ul className="flex">
              {authMenu.map((el, i) => (
                <li key={i}>
                  <NavbarLink href={el.url}>{el.label}</NavbarLink>
                </li>
              ))}
              {!isLogged
                ? menu.map((el, i) => (
                    <li key={i}>
                      <NavbarLink href={el.url}>{el.label}</NavbarLink>
                    </li>
                  ))
                : null}
              {isLogged ? <UserDropdown /> : null}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

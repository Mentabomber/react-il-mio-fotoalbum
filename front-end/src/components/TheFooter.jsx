import { Link } from "react-router-dom";
import { useCompany } from "../contexts/CompanyContext";

function FooterLink({ href, children }) {
  return (
    <Link
      to={href}
      className="text-white text-sm border-b border-transparent hover:border-white duration-300 transition-all"
    >
      {children}
    </Link>
  );
}

export default function TheFooter() {
  const { logo } = useCompany();
  return (
    <footer className="bg-black pt-24 pb-12">
      <div className="container mx-auto px-4 pb-12 flex">
        <div className="bg-white py-2 rounded-lg text-center w-1/3">
          <img src={logo.urlLogoFoot} alt="" className="inline-block mb-4" />
        </div>

        <div className="w-1/3 px-4 lg:px-10">
          <h3 className="font-bold text-white text-xl border-b pb-2 mb-4">
            Link
          </h3>
          <ul className="">
            <li>
              <FooterLink href="/">Home</FooterLink>
            </li>
            <li>
              <FooterLink href="/menu">Menu</FooterLink>
            </li>
            <li>
              <FooterLink href="/contatti">Contatti</FooterLink>
            </li>
          </ul>
        </div>

        <div className="w-1/3 px-4 lg:px-10">
          <h3 className="font-bold text-white text-xl border-b pb-2 mb-4">
            Contatti
          </h3>
          <ul className="text-white">
            <li>
              <FooterLink href="#">Via Roma 124, Roma</FooterLink>
            </li>
            <li>
              <FooterLink href="#">+39 338 1234567</FooterLink>
            </li>
            <li>
              <FooterLink href="#">info@just_post_it.it</FooterLink>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto py-4 text-center border-t ">
        <span className="text-gray-400">Powered by</span>{" "}
        <FooterLink href="#">Tilen Simcic</FooterLink>
      </div>
    </footer>
  );
}

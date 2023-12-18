import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

function DashboardLink({ href, children }) {
  return (
    <Link
      to={href}
      className="text-white text-sm border-b border-transparent hover:border-white duration-300 transition-all"
    >
      {children}
    </Link>
  );
}

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <>
      <div className="container mx-auto px-4">
        <h1 className="text-3xl">
          Benvenuto {user?.name} {user?.surname}
        </h1>
      </div>
      <ul>
        <li>
          <DashboardLink href="/new-post">
            <span className="text-black">Crea un nuovo Post</span>
          </DashboardLink>
        </li>
        <li>
          <DashboardLink href="/show-posts">
            <span className="text-black">Vedi tutti i tuoi Post</span>
          </DashboardLink>
        </li>
      </ul>
    </>
  );
}

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
      <div className="container mx-auto w-4/6">
        <h1 className="text-4xl py-10">
          Benvenuto {user?.name} {user?.surname}
        </h1>
        <ul>
          <li className="py-5 ">
            <DashboardLink href="/new-post">
              <span className="bg-white hover:bg-gray-100 text-gray-800 font-semibold text-2xl py-2 px-4 border border-gray-400 rounded shadow">
                Crea un nuovo Post
              </span>
            </DashboardLink>
          </li>
          <li className="py-5 ">
            <DashboardLink href="/show-posts">
              <span className="bg-white hover:bg-gray-100 text-gray-800 font-semibold text-2xl py-2 px-4 border border-gray-400 rounded shadow">
                Vedi tutti i tuoi Post
              </span>
            </DashboardLink>
          </li>
          {user.role === "superadmin" ? (
            <li className="py-5 ">
              <DashboardLink href="/super-admin-tab">
                <span className="bg-white hover:bg-gray-100 text-gray-800 font-semibold text-2xl py-2 px-4 border border-gray-400 rounded shadow">
                  Super admin tab
                </span>
              </DashboardLink>
            </li>
          ) : null}
        </ul>
      </div>
    </>
  );
}

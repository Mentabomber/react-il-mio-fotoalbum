import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (<>
    <div className="container mx-auto px-4">
      <h1 className="text-3xl">Benvenuto {user?.name} {user?.surname}</h1>
    </div>
  </>);
}
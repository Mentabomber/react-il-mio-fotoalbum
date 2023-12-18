import { useAuth } from "../contexts/AuthContext";

/**
 * @param {{roles: string[]}} param
 */
export default function RoleAccess({ roles, children }) {
  // rullo dell'utente attuale
  const { user } = useAuth();
  const role = user.role;

  // ruoli necessari per visualizzare questi children
  if (roles.includes(role)) {
    return children;
  }

  return null;
}
import { useAuth } from "../contexts/AuthContext";

/**
 * @param {{roles: string[]}} param
 */
export default function RoleAccess({ roles, children }) {
  // ruolo dell'utente attuale
  const { user } = useAuth();

  // credo questo if sia ridondante perché questo caso lo gestisco già in privateroutes ma al momento non capisco perché non funzioni quindi l'ho aggiunto
  if (user == null) {
    return null;
  }
  const role = user.role;

  // ruoli necessari per visualizzare questi children
  if (roles.includes(role)) {
    return children;
  }

  // è necessario ?
  return null;
}

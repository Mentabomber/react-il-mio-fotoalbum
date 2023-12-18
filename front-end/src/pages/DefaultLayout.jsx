import { Outlet } from "react-router-dom";
import TheFooter from "../components/TheFooter";
import TheNavbar from "../components/TheNavbar";
import { CompanyProvider } from "../contexts/CompanyContext";


export default function DefaultLayout() {
  return (
    <>
      <CompanyProvider>
        <TheNavbar></TheNavbar>

        <main className="min-h-[50vh]">
          <Outlet></Outlet>
        </main>

        <TheFooter></TheFooter>
      </CompanyProvider>
    </>
  );
}
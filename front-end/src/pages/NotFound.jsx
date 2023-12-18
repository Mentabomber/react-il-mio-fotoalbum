import TheFooter from "../components/TheFooter";
import TheNavbar from "../components/TheNavbar";
import { CompanyProvider } from "../contexts/CompanyContext";

export default function NotFound() {

  return (
    <CompanyProvider>
      <TheNavbar></TheNavbar>

      <main className="min-h-[50vh]">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-screen">
            <div className="w-full max-w-md">
              <h1>404 - Mi sa che ti sei perso</h1>
            </div>
          </div>
        </div>
      </main>

      <TheFooter></TheFooter>
    </CompanyProvider>);
}
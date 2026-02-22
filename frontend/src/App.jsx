// imports
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";

// project imports
import AppRouter from "./presentation/routes/AppRouter.jsx"

export default function App() {
  return (
    <PrimeReactProvider>
      <AppRouter />
    </PrimeReactProvider>
  );
}

// imports
import { PrimeReactProvider } from "primereact/api";

// project imports
import AppRouter from "./presentation/routes/appRouter.jsx";

export default function App() {
  return (
    <PrimeReactProvider>
      <AppRouter />
    </PrimeReactProvider>
  );
}

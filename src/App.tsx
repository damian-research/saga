import MainWindow from "./pages/MainWindow";
import { SearchProvider } from "./context/SearchContext";

export default function App() {
  return (
    <SearchProvider>
      <MainWindow />
    </SearchProvider>
  );
}

import Header from "../components/layout/Header/Header";
import { SearchTab } from '../pages/search';

export default function MainWindow() {
  return (
    <div className="app-root">
      <Header />
      <div className="app-content">
        <SearchTab />
      </div>
    </div>
  );
}

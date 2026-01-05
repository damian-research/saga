import Header from "../layout/Header";
import SearchTab from "../tabs/search/SearchTab";

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

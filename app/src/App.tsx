import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { SearchScreen } from './pages/search/SearchScreen';
import { VehicleDetail } from './pages/detail/VehicleDetail';
import { ComparisonScreen } from './pages/compare/ComparisonScreen';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<SearchScreen />} />
          <Route path="/vehicles/:id" element={<VehicleDetail />} />
          <Route path="/compare" element={<ComparisonScreen />} />
          <Route path="/saved" element={<div>Saved Vehicles (Coming soon)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

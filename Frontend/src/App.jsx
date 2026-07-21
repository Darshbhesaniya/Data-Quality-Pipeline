import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import ValidationRules from "./pages/ValidationRules";
import Datasets from "./pages/Datasets";
import Executions from "./pages/Executions";
import Results from "./pages/Results";
import Alerts from "./pages/Alerts";
import Settings from "./pages/Settings";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/validation-rules" element={<ValidationRules />} />
        <Route path="/datasets" element={<Datasets />} />
        <Route path="/executions" element={<Executions />} />
        <Route path="/results" element={<Results />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}

export default App
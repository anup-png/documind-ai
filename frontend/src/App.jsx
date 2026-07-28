import { Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route
        path="/documents/:documentId/chat"
        element={<Chat />}
      />
    </Routes>
  );
}

export default App;
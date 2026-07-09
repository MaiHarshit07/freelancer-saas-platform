import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// sabse pehle req yahi aati hai phir app me jati hai then appRoutes then pages and then components 
import App from "./App";

import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
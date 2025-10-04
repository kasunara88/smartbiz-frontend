import { Route, Router } from "react-router-dom";
import "./App.css";
import LoginPage from "./features/auth/LoginPage";
import RegisterPage from "./features/auth/RegisterPage";

function App() {
  return (
    <>
      {/* <LoginPage /> */}
      <RegisterPage />
    </>
  );
}

export default App;

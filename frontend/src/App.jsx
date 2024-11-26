import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import SignUp from "./pages/SignUp"
import NoPage from "./pages/NoPage";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import { useState } from "react";

function App() {
  const [user, setUser] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} />} >
          <Route index element={<Home />} />
          <Route path="/sign-up" element={<SignUp setUser={setUser} />} />
          <Route path="/sign-in" element={<SignIn setUser={setUser} />} />
          <Route path='/home' element={<Home />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App

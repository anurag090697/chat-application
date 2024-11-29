import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home"
import SignUp from "./pages/SignUp"
import NoPage from "./pages/NoPage";
import Layout from "./components/Layout";
import SignIn from "./pages/SignIn";
import { useEffect, useState } from "react";
import axiosInstance from "./config/axios";
import PrivateRouter from "./components/PrivateRouter";
import PublicRouter from "./components/PublicRouter";

function App() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const response = await axiosInstance.get('/user');
      setUser(response.data.user);
    }
    fetchUser();
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={user} setUser={setUser} />} >
          <Route path="/sign-up" element={<PublicRouter><SignUp setUser={setUser} /></PublicRouter>} />
          <Route path="/sign-in" element={<PublicRouter><SignIn setUser={setUser} /></PublicRouter>} />
          <Route path='/home' element={<PrivateRouter><Home user={user} /></PrivateRouter>} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes >
    </BrowserRouter >
  );
}

export default App

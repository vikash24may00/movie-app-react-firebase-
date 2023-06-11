import Header from "./components/Header";
import Cards from "./components/Cards";
import Addmovie from "./components/Addmovie";
import { Route, Routes } from 'react-router-dom'
import Detailpage from './components/Detailpage';
import { createContext, useContext, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";

const Appstate = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");

  return (
    <Appstate.Provider value={{ login, userName, setLogin, setUserName }} >
      <div className="App relative">
        <Header />
        <Routes>
          <Route path="/" element={<Cards />} />
          <Route path="/addmovie" element={<Addmovie />} />
          <Route path="/detailpage/:id" element={<Detailpage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </div>
    </Appstate.Provider>
  );
}

export default App;
export { Appstate }
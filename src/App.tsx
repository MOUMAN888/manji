// import { useState } from 'react'
// import Home from "./pages/Home/Home"
import { Outlet } from 'react-router-dom';


function App() {

  return (
    <>
      <div className="App">
        <Outlet />
      </div>

    </>
  )
}

export default App

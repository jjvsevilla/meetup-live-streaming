import React from "react";
import reactLogo from "./assets/react.svg";
import agGridLogo from "./assets/ag-grid.png";
import "./App.scss";

const openNewWindow = url => window.open(url, "_blank");

function App() {
  const goToReact = () =>
    openNewWindow("https://create-react-app.dev/docs/getting-started");

  const goToAgGrid = () =>
    openNewWindow("https://www.ag-grid.com/javascript-grid-viewport/");

  return (
    <div className="App">
      <header className="header">
        <div className="logos">
          <button onClick={goToReact}>
            <img src={reactLogo} className="logo" alt="React" />
          </button>
          <button onClick={goToAgGrid}>
            <img src={agGridLogo} className="logo" alt="Ag-Grid" />
          </button>
        </div>
        <p>Handling live streaming updates with javascript</p>
      </header>
    </div>
  );
}

export default App;

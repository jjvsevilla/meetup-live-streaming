import React from "react";
import reactLogo from "../../assets/react.png";
import agGridLogo from "../../assets/ag-grid.png";
import rxjsLogo from "../../assets/rxjs.png";
import openfinLogo from "../../assets/openfin.jpeg";
import { Link } from "@reach/router";
import "./Advanced.scss";

const REACT = "react";
const AG_GRID = "ag-grid";
const RXJS = "rxjs";
const OPENFIN = "openfin";
const openNewWindow = url => window.open(url, "_blank");

function Advanced() {
  const goTo = lib => {
    let url;
    switch (lib) {
      case REACT:
        url = "https://create-react-app.dev/docs/getting-started";
        break;
      case AG_GRID:
        url = "https://www.ag-grid.com/javascript-grid-viewport/";
        break;
      case RXJS:
        url = "https://rxjs-dev.firebaseapp.com/";
        break;
      case OPENFIN:
        url = "https://openfin.co/";
        break;
      default:
        break;
    }
    openNewWindow(url);
  };

  return (
    <div className="Advanced">
      <header className="header">
        <div className="logos">
          <button onClick={() => goTo(REACT)}>
            <img src={reactLogo} className="logo" alt="React" />
            <p>ReactJs</p>
          </button>
          <button onClick={() => goTo(AG_GRID)}>
            <img src={agGridLogo} className="logo" alt="Ag-Grid" />
            <p>Ag-Grid</p>
          </button>
          <button onClick={() => goTo(RXJS)}>
            <img src={rxjsLogo} className="logo" alt="RxJs" />
            <p>RxJs</p>
          </button>
          <button onClick={() => goTo(OPENFIN)}>
            <img src={openfinLogo} className="logo" alt="Openfin" />
            <p>Openfin</p>
          </button>
        </div>
        <p>Handling live streaming updates with javascript</p>
        <p className="main-title">
          for financial application in secure environment
        </p>
        <Link to="/">back to the basics</Link>
      </header>
    </div>
  );
}

export default Advanced;

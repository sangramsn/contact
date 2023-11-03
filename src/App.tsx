import React from 'react';
import logo from './logo.svg';
import './App.css';
import AddContactForm from "./addConactForm"
import { store } from './app/store';
function App() {
  return (
    <div className="App">
      {/* Hello */}
      <AddContactForm />
    </div>
  );
}

export default App;

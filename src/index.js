import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { Footer } from './screens/footer';
import { Header } from './screens/header';

ReactDOM.render(
  <>
    <Header/>
    <App/>
    <Footer/>
  </>,
  document.getElementById('root')
);
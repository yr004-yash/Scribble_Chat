import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App';
// import './index.css' 
import { ApolloProvider } from '@apollo/client';

import {client} from "./Graphql/conn";

ReactDOM.createRoot(document.getElementById('root')).render(

  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);


/* 

(1) Main compos: 
-Dash
-Draw
-Word
-Chat
-Standings
-Users

(2) Extra compos:
-hiddencontext  =>used to pass words from Word compo to Chat compo
                =>used to pass usernm from Word compo to Draw compo
                =>used to pass usenames and points from Chat compo to Standings compo

*/
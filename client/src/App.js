import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Provider } from "react-redux";
import store from "./utils/store";
import index from './pages';

// import Loading from "./components/Loading";
const httpLink = createHttpLink({
  uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <div className="wrapper">
      <ApolloProvider client={client}>
        <Router>
          <Provider store={store}>
            <Route exact path="/" component={index} />
          </Provider>
        </Router>
      </ApolloProvider>
    </div>
  );
}

export default App;

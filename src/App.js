// App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import {thunk} from 'redux-thunk';
import rootReducer from './reducers';
import Login from './component/Login';
import Dashboard from './component/Dashboard';
import Signup from './component/Signup';
import Home from './component/Home';
import AddCard from './component/AddCard'
import Gallery from './component/Gallery';
import ImageUpload from './component/ImageUpload';

const store = createStore(rootReducer, applyMiddleware(thunk));

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = sessionStorage.getItem('authToken') !== null;

  return isAuthenticated ? element : <Navigate to="/login" />;
};


const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<ProtectedRoute element={<Dashboard />} />}/>
           {/* <Route path="/dashboard/home" element={<CardFlipper />} /> */}
          <Route path="/dashboard/add-flash-card" element={<ProtectedRoute element={<AddCard />} />}/>
          <Route path="/dashboard/add-gallery" element={<ProtectedRoute element={<ImageUpload />} />}/>
          <Route path="/dashboard/gallery" element={<ProtectedRoute element={<Gallery />} />}/>
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;

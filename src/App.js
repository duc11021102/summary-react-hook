import React from 'react';
import Ingredients from './components/Ingredients/Ingredients';
import Auth from './components/Auth';
import { useContext } from 'react';
import { AuthContext } from './context/auth-context';
const App = props => {
  const authCtx = useContext(AuthContext)
  let context = <Auth />
  if (authCtx.isAuth) {
    context = <Ingredients>
    </Ingredients>
  }
  return context
};

export default App;

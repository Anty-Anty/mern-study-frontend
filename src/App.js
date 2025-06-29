import React, { Suspense } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// import Users from './user/pages/Users';
// import NewPlace from './places/pages/NewPlace';
// import UserPlaces from './places/pages/UserPlaces';
// import UpdatePlace from './places/pages/UpdatePlace';
// import Auth from './user/pages/Auth';
import MainNavigation from './shared/components/Navigation/MainNavigation';
import { AuthContext } from './shared/context/auth-context';
import { useAuth } from './shared/hooks/auth-hook';
import LoadingSpinner from './shared/components/UIElements/LoadingSpinner';

//lect 201
const Users = React.lazy(() => import('./user/pages/Users'));
const NewPlace = React.lazy(() => import('./places/pages/NewPlace'));
const UserPlaces = React.lazy(() => import('./places/pages/UserPlaces'));
const UpdatePlace = React.lazy(() => import('./places/pages/UpdatePlace'));
const Auth = React.lazy(() => import('./user/pages/Auth'));



function App() {

  const { token, login, logout, userId } = useAuth();

  // lecture 77 
  let routes;

  // if (isLoggedIn) {
  if (token) {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>


        <Route path="/places/new" exact>
          <NewPlace />
        </Route>

        {/* if we place path={'/places/:placeId'} before path="/places/new" then 'new' would be read as on of ':placeId'.
          That is why it should be placed after  */}
        <Route path='/places/:placeId'>
          <UpdatePlace />
        </Route>

        <Redirect to="/" />

      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path="/" exact>
          <Users />
        </Route>

        <Route path='/:userId/places' exact>
          <UserPlaces />
        </Route>

        <Route path="/auth">
          <Auth />
        </Route>

        <Redirect to="/auth" />

      </Switch>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        // isLoggedIn: isLoggedIn, 
        isLoggedIn: !!token,
        token: token,
        userId: userId,
        login: login,
        logout: logout
      }}
    >
      <Router>
        <MainNavigation />
        <main>
          <Suspense fallback={
            <div className='center'>
              <LoadingSpinner />
            </div>
          }>

            {routes}

          </Suspense>
        </main>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

import { useState, useCallback, useEffect } from 'react';

//lect 190
let logoutTimer;

export const useAuth = () => {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState(false);



  const login = useCallback((uid, token) => {
    // setIsLoggedIn(true);
    setToken(token);
    setUserId(uid);
    //lect 189 token experation date
    // tokenExpirationDate is diclared inside function and then tokenExpirationDate in state is updated with its value
    const tokenExpirationDate = new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    //lect 187
    localStorage.setItem(
      'userData',
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: tokenExpirationDate.toISOString()

      })
    );

  }, []);

  const logout = useCallback(() => {
    // setIsLoggedIn(false);
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem('userData')
  }, []);

  //lect 190 automatic logout after token expires
  useEffect(() => {
    if (token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  // lect 188
  // it checks local storage for a token (run once when app restarted and page reloaded)
  // useEffect renders after component runs, so component will run in unauthenticated state and then useEffect will run
  // потом он добавил dependency to useEffect, так что хз,
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (
      storedData && 
      storedData.token && 
      new Date(storedData.expiration) > new Date()
    ) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  }, [login]);

  return { token, login, logout, userId };
};
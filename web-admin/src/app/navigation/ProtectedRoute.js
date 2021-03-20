import React, { useEffect, useState } from "react";
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import { axiosInstance } from "../api/config";
import FullscreenProgress from "../components/FullscreenProgress";

const CACHE_PATH = "cache-path";

function ProtectedRoute(props) {
  const history = useHistory();
  const location = useLocation();

  const [isLoading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("authToken") == null) {
      localStorage.setItem(CACHE_PATH, location.pathname);
      setValid(false);
      setLoading(false);
      return;
    }
    if (localStorage.getItem(CACHE_PATH)) {
      history.push(localStorage.getItem(CACHE_PATH));
      localStorage.removeItem(CACHE_PATH);
    }
    fetchUser();
  }, []);

  const fetchUser = () => {
    axiosInstance
      .get("/api/users/me")
      .then(({ data }) => {
        console.log(data);
        setValid(true);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error);
      });
  };

  if (isLoading) {
    return <FullscreenProgress open={true} />;
  }

  if (error) {
    return <Redirect to="/" />;
  }

  return (
    <>
      {valid ? (
        <Route path={props.path} exact component={props.children} {...props} />
      ) : (
        <Redirect to="/" />
      )}
    </>
  );
}

export default ProtectedRoute;

import React, { useEffect, useState } from "react";
import { Route, Redirect, useLocation, useHistory } from "react-router-dom";
import { axiosInstance } from "../api/config";
import * as axios from "axios";
import FullscreenProgress from "../components/FullscreenProgress";
import routes, { permissionTags } from "./routes";
import usePermission from "../navigation/usePermission";

const CACHE_PATH = "cache-path";

function ProtectedRoute({ match = null, ...props }) {
  const history = useHistory();
  const location = useLocation();

  const [isLoading, setLoading] = useState(true);
  const [valid, setValid] = useState(false);
  const [error, setError] = useState(null);
  const { permissionReady, permissions, getPermission } = usePermission();

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
        // console.log(data);
        setValid(true);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
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

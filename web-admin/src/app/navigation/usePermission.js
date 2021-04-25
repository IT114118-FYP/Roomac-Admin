import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api/config";

function usePermission(something) {
  const [permissionReady, setPermissionReady] = useState(false);

  const fetchPermissions = () => {
    const user_id = localStorage.getItem("user_id");
    axiosInstance
      .get(`api/users/${user_id}/permissions`)
      .then(({ data }) => {
        // console.log(data);
        localStorage.setItem('permissions', JSON.stringify(data));
        localStorage.setItem('permissionReady', true);
      })
      .catch((error) => console.log(error))
      .finally(() => setPermissionReady(true));
  };

  useEffect(() => {
    const ready = localStorage.getItem("permissionReady") ? JSON.parse(localStorage.getItem("permissions")) : false;
    if (ready){
      setPermissionReady(true);
    }
  }, []);

  useEffect(() => {
    if (!something){
      return;
    }
    if (!permissionReady) {
      fetchPermissions();
    };
  }, []);

  const getPermission = (name) => {
    const data = localStorage.getItem("permissions") ? JSON.parse(localStorage.getItem("permissions")) : null;
    const ready = localStorage.getItem("permissionReady") ? localStorage.getItem("permissionReady") : null;
    // console.log(data);
    if (!ready) return null;
    const currentPermission = data.find(
      (permission) => permission.name === name
    );
    if (currentPermission == "undefined") return;

    if (currentPermission.granted) {
      return true;
    } else {
      return false;
    }
  };

  return { permissionReady, getPermission };
}

export default usePermission;

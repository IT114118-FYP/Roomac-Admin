import React, { useState, useEffect } from "react";
import { axiosInstance } from "../api/config";
import { permissionTags } from "./routes";

function usePermission() {
  const [permissionReady, setPermissionReady] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const fetchUser = () => {
    axiosInstance.get("/api/users/me").then(({ data }) => {
      fetchPermissions(data.id);
    });
  };

  const fetchPermissions = (id) => {
    axiosInstance
      .get(`api/users/${id}/permissions`)
      .then(({ data }) => {
        console.log(data);
        setPermissions(data);
      })
      .catch((error) => console.log(error))
      .finally(() => setPermissionReady(true));
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const getPermission = (name) => {
    if (!permissionReady) return null;
    const currentPermission = permissions.find(
      (permission) => permission.name === name
    );
    if (currentPermission == "undefined") return;

    if (currentPermission.granted) {
      return true;
    } else {
      return false;
    }
  };

  return { permissionReady, permissions, getPermission };
}

export default usePermission;

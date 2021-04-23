import {
  Box,
  Breadcrumbs,
  Divider,
  Tab,
  Tabs,
  Typography,
  Button,
} from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import { axiosInstance } from "../../api/config";
import ConfirmDialog from "../../components/ConfirmDialog";
import EditField from "../../components/forms/edit/EditField";
import EditForm from "../../components/forms/edit/EditForm";
import NavDrawer from "../../components/NavDrawer";
import usePermission from "../../navigation/usePermission";
import routes, { TAG } from "../../navigation/routes";

function TabPanel({ children, value, index, ...other }) {
  return (
    <Box hidden={value !== index} {...other} marginTop={2}>
      {value === index && <div>{children}</div>}
    </Box>
  );
}

function DetailedTOSPage({ match }) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [tos, setTos] = useState({});
  const [error, setError] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { permissionReady, getPermission } = usePermission();

  useEffect(() => {
    fetchTos();
  }, []);

  const fetchTos = () => {
    setLoading(true);
    axiosInstance
      .get(`api/tos/${match.params.id}`)
      .then(({ data }) => {
        setTos(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  const updateTos = (name, value) => {
    setLoading(true);
    axiosInstance
      .put(`api/tos/${match.params.id}`, {
        id: name === "id" ? value : tos.id,
        tos_en: name === "tos_en" ? value : tos.tos_en,
        tos_hk: name === "tos_hk" ? value : tos.tos_hk,
        tos_cn: name === "tos_cn" ? value : tos.tos_cn,
      })
      .then(() => {
        fetchTos();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteTos = () => {
    axiosInstance.delete(`api/tos/${match.params.id}`).then(() => {
      history.push(routes.tos.MANAGE);
    });
  };

  function GeneralTabPanel() {
    return (
      <EditForm title="TOS info">
        <EditField
          loading={isLoading}
          name="English"
          value={tos.tos_en}
          onSave={(newValue) => updateTos("tos_en", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
          }
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Chinese (traditional)"
          value={tos.tos_hk}
          onSave={(newValue) => updateTos("tos_hk", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
          }
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Chinese (simplified)"
          value={tos.tos_cn}
          onSave={(newValue) => updateTos("tos_cn", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.tos) ? true : false
          }
        />
      </EditForm>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        {getPermission(TAG.CRUD.DELETE + TAG.routes.tos) && (
          <Box flexGrow={1}>
            <Typography variant="body1" color="textPrimary">
              Delete tos
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upon deletion, the tos will not be recoverable.
            </Typography>
          </Box>
        )}
        {getPermission(TAG.CRUD.DELETE + TAG.routes.tos) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteOpen(true)}
          >
            Delete tos
          </Button>
        )}
      </Box>
    );
  }

  return (
    <NavDrawer>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={routes.tos.MANAGE}>tos</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Tos Not Found...</Typography>
          <Link to={routes.tos.MANAGE}>go back</Link>
        </Box>
      ) : (
        <div>
          <Box marginBottom={2} marginTop={3}>
            <Typography
              variant="h5"
              component="div"
              style={{
                fontWeight: "bold",
              }}
            >
              {/* {isLoading ? <Skeleton /> : `${tos.tos_en}`} */}
            </Typography>
            <Typography variant="h6" component="div" color="textSecondary">
              {isLoading ? <Skeleton /> : `Terms and Conditions Code ${tos.id}`}
            </Typography>
          </Box>

          <Tabs
            value={tabIndex}
            onChange={(event, newValue) => {
              setTabIndex(newValue);
            }}
          >
            <Tab
              label="General"
              style={{
                outline: "none",
              }}
            />
            <Tab
              label="Settings"
              style={{
                outline: "none",
              }}
            />
          </Tabs>

          <TabPanel value={tabIndex} index={0}>
            <GeneralTabPanel />
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <SettingsTabPanel />
          </TabPanel>
        </div>
      )}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={deleteTos}
        title={`Delete tos ${tos.id}?`}
      >
        <Typography>Upon deletion, the tos will not be recoverable.</Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedTOSPage;

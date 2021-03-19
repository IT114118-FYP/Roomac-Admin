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
import EditPickerField from "../../components/forms/edit/EditPickerField";
import NavDrawer from "../../components/NavDrawer";
import routes from "../../navigation/routes";

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

  const updateTOS = (name, value) => {
    setLoading(true);
    axiosInstance
      .put(`api/tos/${match.params.id}`, {
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

  const deleteTOS = () => {
    axiosInstance.delete(`api/tos/${match.params.id}`).then(() => {
      history.push(routes.programs.MANAGE);
    });
  };

  function GeneralTabPanel() {
    return (
      <EditForm title="Teams And Conditions info">
        <EditField
          loading={isLoading}
          name="Teams And Conditions code"
          value={tos.id}
          // onSave={(newValue) => updateTOS("id", newValue)}
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="English"
          value={tos.tos_en}
          onSave={(newValue) => updateTOS("tos_en", newValue)}
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Chinese (traditional)"
          value={tos.tos_hk}
          onSave={(newValue) => updateTOS("tos_hk", newValue)}
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Chinese (simplified)"
          value={tos.tos_cn}
          onSave={(newValue) => updateTOS("tos_cn", newValue)}
        />
      </EditForm>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        <Box flexGrow={1}>
          <Typography variant="body1" color="textPrimary">
            Delete Teams And Conditions
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Upon deletion, the Teams And Conditions will not be recoverable.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => setDeleteOpen(true)}
        >
          Delete TOS
        </Button>
      </Box>
    );
  }

  return (
    <NavDrawer>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={routes.branches.MANAGE}>Teams And Conditions</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">
            Teams And Conditions Not Found...
          </Typography>
          <Link to={routes.branches.MANAGE}>go back</Link>
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
              {isLoading ? <Skeleton /> : `Teams And Conditions`}
            </Typography>
            <Typography variant="h6" component="div" color="textSecondary">
              {isLoading ? <Skeleton /> : `Code ${tos.id}`}
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
        // onConfirm={deleteProgram}
        title={`Delete Teams And Conditions ${tos.id}?`}
      >
        <Typography>
          Upon deletion, the programme will not be recoverable.
        </Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedTOSPage;

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

function DetailedProgramPage({ match }) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(true);
  const [program, setProgram] = useState({});
  const [error, setError] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { permissionReady, permissions, getPermission } = usePermission();

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = () => {
    setLoading(true);
    axiosInstance
      .get(`api/programs/${match.params.id}`)
      .then(({ data }) => {
        setProgram(data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(true);
      });
  };

  const updateProgram = (name, value) => {
    setLoading(true);
    axiosInstance
      .put(`api/programs/${match.params.id}`, {
        id: name === "id" ? value : program.id,
        title_en: name === "title_en" ? value : program.title_en,
        title_hk: name === "title_hk" ? value : program.title_hk,
        title_cn: name === "title_cn" ? value : program.title_cn,
      })
      .then(() => {
        fetchProgram();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const deleteProgram = () => {
    axiosInstance.delete(`api/programs/${match.params.id}`).then(() => {
      history.push(routes.programs.MANAGE);
    });
  };

  function GeneralTabPanel() {
    return (
      <EditForm title="Prgramme info">
        <EditField
          loading={isLoading}
          name="programme code"
          value={program.id}
          onSave={(newValue) => updateProgram("id", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.programs) ? true : false
          }
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="English"
          value={program.title_en}
          onSave={(newValue) => updateProgram("title_en", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.programs) ? true : false
          }
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Chinese (traditional)"
          value={program.title_hk}
          onSave={(newValue) => updateProgram("title_hk", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.programs) ? true : false
          }
        />
        <Divider />
        <EditField
          loading={isLoading}
          name="Chinese (simplified)"
          value={program.title_cn}
          onSave={(newValue) => updateProgram("title_cn", newValue)}
          editable={
            getPermission(TAG.CRUD.UPDATE + TAG.routes.programs) ? true : false
          }
        />
      </EditForm>
    );
  }

  function SettingsTabPanel() {
    return (
      <Box flexDirection="row" display="flex" marginTop={2}>
        {getPermission(TAG.CRUD.DELETE + TAG.routes.programs) && (
          <Box flexGrow={1}>
            <Typography variant="body1" color="textPrimary">
              Delete program
            </Typography>
            <Typography variant="caption" color="textSecondary">
              Upon deletion, the programme will not be recoverable.
            </Typography>
          </Box>
        )}
        {getPermission(TAG.CRUD.DELETE + TAG.routes.programs) && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setDeleteOpen(true)}
          >
            Delete Program
          </Button>
        )}
      </Box>
    );
  }

  return (
    <NavDrawer>
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={routes.programs.MANAGE}>programs</Link>
        <Typography color="textPrimary">details</Typography>
      </Breadcrumbs>
      {error ? (
        <Box
          alignItems="center"
          justifyContent="center"
          display="flex"
          flexDirection="column"
        >
          <Typography variant="h6">Programme Not Found...</Typography>
          <Link to={routes.programs.MANAGE}>go back</Link>
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
              {isLoading ? <Skeleton /> : `${program.title_en}`}
            </Typography>
            <Typography variant="h6" component="div" color="textSecondary">
              {isLoading ? <Skeleton /> : `Programme Code ${program.id}`}
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
        onConfirm={deleteProgram}
        title={`Delete Program ${program.id}?`}
      >
        <Typography>
          Upon deletion, the programme will not be recoverable.
        </Typography>
      </ConfirmDialog>
    </NavDrawer>
  );
}

export default DetailedProgramPage;

import {
  Divider,
  Typography,
  Box,
  CircularProgress,
  Button,
} from "@material-ui/core";
import { Formik } from "formik";

import * as Yup from "yup";
import React, { useState } from "react";
import { axiosInstance } from "../../api/config";
import NewField from "../../components/forms/new/NewField";
import NavDrawer from "../../components/NavDrawer";
import NewButton from "../../components/forms/new/NewButton";
import SnackbarAlert from "../../components/SnackbarAlert";
import routes from "../../navigation/routes";
import { useHistory } from "react-router-dom";

const validationSchema = Yup.object().shape({
  tos_en: Yup.string().required().min(4).label("English title"),
  tos_hk: Yup.string().required().min(4).label("Chinese title (traditional)"),
  tos_cn: Yup.string().required().min(4).label("Chinese title (simplified)"),
});

function NewTOSPage(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [error, setError] = useState(false);

  const createTOS = ({ tos_en, tos_hk, tos_cn }) => {
    setLoading(true);
    axiosInstance
      .post(`api/tos`, {
        tos_en,
        tos_hk,
        tos_cn,
      })
      .then(() => {
        setSuccess(true);
        setSuccessAlert(true);
        setLoading(false);
      })
      .catch((e) => {
        setError(true);
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <NavDrawer>
      <Formik
        initialValues={{
          tos_en: "",
          tos_hk: "",
          tos_cn: "",
        }}
        onSubmit={createTOS}
        validationSchema={validationSchema}
      >
        <>
          <Box marginBottom={2}>
            <Typography
              variant="h4"
              style={{
                fontWeight: "bold",
              }}
            >
              New Terms And Conditions
            </Typography>
          </Box>
          <Divider />
          <Box marginTop={3} marginBottom={3}>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              Terms And Conditions Details
            </Typography>
            <NewField
              title="English"
              name="tos_en"
              disabled={success || isLoading}
            />
            <NewField
              title="Chinese (Traditional)"
              name="tos_hk"
              disabled={success || isLoading}
            />
            <NewField
              title="Chinese (Simplified)"
              name="tos_cn"
              disabled={success || isLoading}
            />
          </Box>
          <Box
            marginTop={3}
            display="flex"
            flexDirection="row-reverse"
            alignItems="center"
          >
            <Box marginLeft={2}>
              <NewButton
                title="Create Terms And Conditions"
                color="primary"
                variant="contained"
                disabled={success || isLoading}
              />
            </Box>
            {isLoading && <CircularProgress size={30} />}
          </Box>
        </>
      </Formik>
      <SnackbarAlert
        open={successAlert}
        onClose={() => setSuccessAlert(false)}
        severity="success"
        alertText="Successful"
        action={
          <Button
            color="inherit"
            size="small"
            onClick={() => history.push(routes.tos.MANAGE)}
          >
            Go Back
          </Button>
        }
      />
      <SnackbarAlert
        open={error}
        onClose={() => setError(false)}
        alertText="There is an error."
      />
    </NavDrawer>
  );
}

export default NewTOSPage;

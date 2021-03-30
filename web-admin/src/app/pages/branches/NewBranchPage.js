import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Divider,
  Typography,
  Box,
  CircularProgress,
  Button,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Radio,
} from "@material-ui/core";

import { axiosInstance } from "../../api/config";
import NewField from "../../components/forms/new/NewField";
import NavDrawer from "../../components/NavDrawer";
import NewButton from "../../components/forms/new/NewButton";
import SnackbarAlert from "../../components/SnackbarAlert";
import { useHistory } from "react-router-dom";
import routes from "../../navigation/routes";

const validationSchema = Yup.object().shape({
  id: Yup.string().required().min(1).label("Branch id"),
  title_en: Yup.string().required().min(1).label("English title"),
  title_hk: Yup.string().required().min(1).label("Chinese title (traditional)"),
  title_cn: Yup.string().required().min(1).label("Chinese title (simplified)"),
  lat: Yup.number().required().moreThan(0).label("Latitude"),
  lng: Yup.number().required().moreThan(0).label("Longitude"),
});

function NewBranchPage(props) {
  const history = useHistory();
  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [error, setError] = useState(false);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [imgMethod, setImgMethod] = useState("None");

  const handleImgMethodChange = (event) => {
    setImgMethod(event.target.value);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    setSelectedFile(e.target.files[0]);
  };

  const createProgram = ({
    id,
    title_en,
    title_hk,
    title_cn,
    lat,
    lng,
    image_url,
  }) => {
    setLoading(true);

    let formData = new FormData();
    formData.set("id", id);
    formData.set("title_en", title_en);
    formData.set("title_hk", title_hk);
    formData.set("title_cn", title_cn);
    formData.set("lat", lat);
    formData.set("lng", lng);

    if (imgMethod === "Upload Image File") {
      formData.set("image", selectedFile);
    } else if (imgMethod === "Image Url") {
      formData.set("image_url", image_url);
    }

    axiosInstance
      .post(`api/branches`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        setSuccess(true);
        setSuccessAlert(true);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <NavDrawer>
      <Formik
        initialValues={{
          id: "",
          title_en: "",
          title_hk: "",
          title_cn: "",
          lat: "",
          lng: "",
        }}
        onSubmit={createProgram}
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
              New Branch
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
              Branch Details
            </Typography>
            <NewField
              title="Branch id"
              name="id"
              autoFocus={true}
              disabled={success || isLoading}
            />
            <NewField
              title="English"
              name="title_en"
              disabled={success || isLoading}
            />
            <NewField
              title="Chinese (Traditional)"
              name="title_hk"
              disabled={success || isLoading}
            />
            <NewField
              title="Chinese (Simplified)"
              name="title_cn"
              disabled={success || isLoading}
            />
            <NewField
              title="Latitude"
              name="lat"
              disabled={success || isLoading}
            />
            <NewField
              title="Longitude"
              name="lng"
              disabled={success || isLoading}
            />
          </Box>

          <Divider />
          <Box marginTop={3} marginBottom={3}>
            <Typography
              variant="h6"
              style={{
                fontWeight: "bold",
              }}
            >
              Branch Attachments (Under Construction)
            </Typography>
            <Box marginTop={2}>
              <FormControl component="fieldset">
                <RadioGroup
                  name="Image Method"
                  value={imgMethod}
                  onChange={handleImgMethodChange}
                >
                  <FormControlLabel
                    value="None"
                    control={<Radio color="primary" />}
                    label="None"
                  />
                  <FormControlLabel
                    value="Image Url"
                    control={<Radio color="primary" />}
                    label="Image Url"
                  />
                  <FormControlLabel
                    value="Upload Image File"
                    control={<Radio color="primary" />}
                    label="Upload Image File"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
            {imgMethod === "Image Url" && <NewField name="Image Url" />}
            {imgMethod === "Upload Image File" && (
              <>
                <div>
                  <input
                    accept="image/*"
                    id="image"
                    type="file"
                    style={{
                      display: "none",
                    }}
                    onChange={onSelectFile}
                  />
                  <label htmlFor="image">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                    >
                      Upload Image File
                    </Button>
                  </label>
                </div>
                <div>
                  {selectedFile && (
                    <img src={preview} width="480" height="320" alt="Preview" />
                  )}
                </div>
              </>
            )}
          </Box>
          <Divider />

          <Box
            marginTop={3}
            display="flex"
            flexDirection="row-reverse"
            alignItems="center"
          >
            <Box marginLeft={2}>
              <NewButton
                title="Create Branch"
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
            onClick={() => history.push(routes.branches.MANAGE)}
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

export default NewBranchPage;

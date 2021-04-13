import {
  Divider,
  Typography,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  FormControl,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { Formik } from "formik";

import * as Yup from "yup";
import * as axios from "axios";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api/config";
import NewField from "../../components/forms/new/NewField";
import NavDrawer from "../../components/NavDrawer";
import NewButton from "../../components/forms/new/NewButton";
import NewPickerField, {
  createNewPickerValue,
} from "../../components/forms/new/NewPickerField";
import SnackbarAlert from "../../components/SnackbarAlert";
import routes from "../../navigation/routes";
import { useHistory } from "react-router-dom";

import usePermission from "../../navigation/usePermission";

const validationSchema = Yup.object().shape({
  branch_id: Yup.string().required().label("Branch"),
  email: Yup.string().required().email().label("Email"),
  name: Yup.string().required().min(5).label("CNA"),
  program_id: Yup.string().required().label("Programme"),
  password: Yup.string().required().min(8).label("Password"),
});

function NewUserPage(props) {
  const history = useHistory();

  const [isLoading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [error, setError] = useState(false);
  const [branches, setBranches] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [imgMethod, setImgMethod] = useState("None");
  const { permissionReady, permissions, getPermission } = usePermission();

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!permissionReady) return;
    if (!getPermission("create:users")) {
      alert("No Permission");
      history.push(routes.HOME);
    }
  }, [permissionReady]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [branches, programs] = await axios.all([
        fetchBranches(),
        fetchPrograms(),
      ]);
      const branchesPickerItem = branches.data.map((item) => {
        return createNewPickerValue(item.id, item.title_en);
      });
      branchesPickerItem.unshift(createNewPickerValue("none", "none"));
      setBranches(branchesPickerItem);

      const programsPickerItem = programs.data.map((item) => {
        return createNewPickerValue(item.id, item.title_en);
      });
      programsPickerItem.unshift(createNewPickerValue("none", "none"));
      setPrograms(programsPickerItem);

      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };

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

  const fetchBranches = () => axiosInstance.get(`api/branches`);
  const fetchPrograms = () => axiosInstance.get(`api/programs`);

  const createUser = ({
    branch_id,
    chinese_name,
    email,
    first_name,
    last_name,
    name,
    program_id,
    password,
    image_url,
  }) => {
    setLoading(true);

    let formData = new FormData();
    formData.set("branch_id", branch_id);
    formData.set("chinese_name", chinese_name);
    formData.set("email", email);
    formData.set("first_name", first_name);
    formData.set("last_name", last_name);
    formData.set("name", name);
    formData.set("program_id", program_id === "none" ? null : program_id);
    formData.set("password", password);

    if (imgMethod === "Upload Image File") {
      formData.set("image", selectedFile);
    } else if (imgMethod === "Image Url") {
      formData.set("image_url", image_url);
    }

    axiosInstance
      .post(`api/users`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then(() => {
        setSuccess(true);
        setSuccessAlert(true);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  };

  return (
    <NavDrawer>
      <Formik
        initialValues={{
          branch_id: "none",
          chinese_name: "",
          email: "",
          first_name: "",
          last_name: "",
          name: "",
          program_id: "none",
          password: "",
          image_url: "",
        }}
        onSubmit={createUser}
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
              New User
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
              User Basic Info
            </Typography>
            <NewField
              title="First Name"
              name="first_name"
              autoFocus={true}
              disabled={success || isLoading}
            />
            <NewField
              title="Last Name"
              name="last_name"
              disabled={success || isLoading}
            />
            <NewField
              title="Chinese Name"
              name="chinese_name"
              disabled={success || isLoading}
            />
            <NewField title="CNA" name="name" disabled={success || isLoading} />
            <NewField
              title="Password"
              name="password"
              disabled={success || isLoading}
              type="password"
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
              Association Info
            </Typography>
            <NewPickerField
              title="Branch"
              name="branch_id"
              disabled={success || isLoading}
              pickerItem={branches}
            />
            <NewPickerField
              title="Programme"
              name="program_id"
              disabled={success || isLoading}
              pickerItem={programs}
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
              Contact Info
            </Typography>
            <NewField
              title="Email"
              name="email"
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
              User Attachments (Under Construction)
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
            {imgMethod === "Image Url" && <NewField name="image_url" />}
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
                title="Create Category"
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
            onClick={() => history.push(routes.users.MANAGE)}
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

export default NewUserPage;

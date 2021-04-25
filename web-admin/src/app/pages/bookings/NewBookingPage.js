import {
	Divider,
	Typography,
	Box,
	CircularProgress,
	Button,
    Grid,
	makeStyles,
	TextField,
} from "@material-ui/core";
import { Formik } from "formik";
import EditForm from "../../components/forms/edit/EditForm";

import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api/config";
import NavDrawer from "../../components/NavDrawer";
import SnackbarAlert from "../../components/SnackbarAlert";
import { Route, useHistory } from "react-router-dom";

const validationSchema = Yup.object().shape({
	// user_id: Yup.string().required().min(1).label("CNA"),
});

const useStyles = makeStyles((theme) => ({
	viewHeaderBar: {
	  display: "flex",
	  flexDirection: "row",
	  marginBottom: theme.spacing(3),
	},
	viewHeaderBarItems: {
	  marginRight: theme.spacing(5),
	},
  }));

function NewBookingPage(props,{match}) {
	const classes = useStyles();
	const history = useHistory();
	const [isLoading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [successAlert, setSuccessAlert] = useState(false);
	const [error, setError] = useState(false);
	const [bookingData, setbookingData] = useState([]);
	const [searchTerms, setSearchTerms] = useState([]);
	const [data, setUserData] = useState([]);
	const [bookingUser, setBookingUser] = useState([]);
	

	useEffect(() => {
		// if (props.location.data!=null){
			// setbookingData(props.location.data);
			// fetchUser();
		// }else{
			alert("Please select the booking from the resource!")
			history.push("/resources");
		// }
	  }, []);

	const createBooking = () => {
		setLoading(true);
		axiosInstance
			.post(`api/resources/${bookingData.resource_id}/bookings`, {
                user_id:bookingUser,
				date:bookingData.date,
				start:bookingData.start,
				end:bookingData.end,
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

	const fetchUser = async() => await axiosInstance.get(`api/users`).then((data)=>setUserData(data.data));

	useEffect(()=>{
		console.log(searchTerms);
		if (searchTerms.length == 1){
			console.log(searchTerms[0].id);
			setBookingUser(searchTerms[0].id);
		}
	},[searchTerms]);

	const searchFunction = (value) =>{
		if (value !== ""){
		  const newList = data.filter((contact)=>{
			var key = Object.keys(contact).map(function(key) {
			  return contact[key];
		  });
			return key.join(" ").toLowerCase().includes(value.toLowerCase());
		  })
		  setSearchTerms(newList);
		}  else {
		  setSearchTerms(value);
		}
	  };

	return (
		<NavDrawer>
							<>
					<Box marginBottom={2}>
						<Typography
							variant="h4"
							style={{
								fontWeight: "bold",
							}}
						>
							New Booking
						</Typography>
					</Box>
					<Box marginTop={3} marginBottom={3}>
						
						<EditForm title="Booking Details">
							<div style={{marginTop:10,}}></div>
						<Divider />

                        <div style={{height:50,marginTop:10,}}>
								<Grid container spacing={1}>
									<Grid item xs={4}>
		  							<h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    	CNA
                                    </h6>
									</Grid>
      								<Grid item xs={8}>
      								<div className={classes.viewHeaderBar}>
        								<TextField
          									className={classes.viewHeaderBarItems}
											id="search-bar"
											placeholder="Please input the CNA"
											onChange={(event)=>searchFunction(event.target.value)}
											/>
										</div>
										</Grid>
										</Grid>
                                </div>
								<Divider />
								<div style={{height:50,marginTop:10,}}>
                        <Grid container spacing={1}>     
                            <Grid item xs={4}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    Student Name
                                    </h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    {searchTerms.length==1 ? searchTerms[0].last_name + " " + searchTerms[0].first_name : "-"}
                                    </h6>
                                </Grid>
                                </Grid>
                                </div>
								<Divider />
                        <div style={{height:50,marginTop:10,}}>
                        <Grid container spacing={1}>     
                            <Grid item xs={4}>

                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    Resource
                                    </h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    {!bookingData ? "-" : bookingData.resource}
                                    </h6>
                                </Grid>
                                </Grid>
                                </div>
								<Divider />
                        <div style={{height:50,marginTop:10,}}>
                        <Grid container spacing={1}>     
                            <Grid item xs={4}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    Date
                                    </h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    {!bookingData ? "-" : bookingData.date}
                                    </h6>
                                </Grid>
                                </Grid>
                                </div>
								<Divider />
                                <div style={{height:50,marginTop:10,}}>
                        <Grid container spacing={1}>     
                            <Grid item xs={4}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    Start Time
                                    </h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    {!bookingData ? "-" : bookingData.start}
                                    </h6>
                                </Grid>
                                </Grid>
                                </div>
								<Divider />
                                <div style={{height:50,marginTop:10,}}>
                        <Grid container spacing={1}>     
                            <Grid item xs={4}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    End Time
                                    </h6>
                                </Grid>
                                <Grid item xs={6}>
                                    <h6 style={{color:"gray",fontWeight:"normal",fontSize:14}} >
                                    {!bookingData ? "-" : bookingData.end}
                                    </h6>
                                </Grid>
                                </Grid>
                                </div>
								</EditForm>
					</Box>
					<Box
						display="flex"
					>
							<Button
								style={{marginLeft:"auto"}}
								color="primary"
								variant="contained"
								disabled={isLoading||searchTerms.length!=1||success}
								onClick={()=>createBooking()}
							>Create Booking</Button>
						{isLoading && <CircularProgress size={30} />}
					</Box>
				</>
			<SnackbarAlert
				open={successAlert}
				onClose={() => setSuccessAlert(false)}
				severity="success"
				alertText="Successful"
				action={
					<Button
						color="inherit"
						size="small"
						onClick={() => history.push(`/resources/${bookingData.resource_id}`)}
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

export default NewBookingPage;

import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { Avatar } from "@material-ui/core";

import Icon_bookings from "../resources/bookings.png";
import Icon_branch from "../resources/branch.png";
import Icon_category from "../resources/category.png";
import Icon_resource from "../resources/resource.png";
import Icon_user from "../resources/user.png";

const useStyles = makeStyles((theme) => ({
  card: {
    // minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
    textAlign: "center",
  },
  countNumber: {
    textAlign: "center",
  },
  media: {
    // ⚠️ object-fit is not supported by IE 11.
    objectFit: "scale-down",
    padding: theme.spacing(2),
    height: 100,
  },
}));

function CardView({ title, count, click }) {
  const classes = useStyles();
  return (
    <Card className={classes.card} onClick={click}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          {title}
        </Typography>
        {title == "Total Bookings" ? (
          <CardMedia
            component="img"
            alt=""
            className={classes.media}
            image={Icon_bookings}
          />
        ) : (
          <></>
        )}

        {title == "Total Branch" ? (
          <CardMedia
            component="img"
            alt=""
            className={classes.media}
            image={Icon_branch}
          />
        ) : (
          <></>
        )}
        {title == "Total Category" ? (
          <CardMedia
            component="img"
            alt=""
            className={classes.media}
            image={Icon_category}
          />
        ) : (
          <></>
        )}
        {title == "Total Resource" ? (
          <CardMedia
            component="img"
            alt=""
            className={classes.media}
            image={Icon_resource}
          />
        ) : (
          <></>
        )}
        {title == "Totol User" ? (
          <CardMedia
            component="img"
            alt=""
            className={classes.media}
            image={Icon_user}
          />
        ) : (
          <></>
        )}
        <Typography component="p" className={classes.countNumber}>
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default CardView;

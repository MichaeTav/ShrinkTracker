import React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  CardHeader,
  Divider,
  Box,
} from "@mui/material";
import moment from "moment";

import DeleteShrinkItemButton from "./buttons/DeleteShrinkItemButton";

export default function ShrinkItemCard({
  shrinkItem: {
    id,
    expirationDate,
    quantity,
    userWhoAdded,
    dateAdded,
    item: { name, upc, department },
  },
}) {
  const userWhoAddedString = "Added by " + userWhoAdded + " on " + dateAdded;

  return (
    <div>
      <Card sx={{ width: 350, height: 225, margin: "auto" }}>
        <CardHeader
          action={
            <CardMedia
              component="img"
              sx={{ width: 75, height: 75, margin: "auto" }}
              image="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          }
          title={name}
          subheader={userWhoAddedString}
        />
        <Divider variant="middle" />
        <CardContent>
          <CardActions disableSpacing>
            <Typography variant="body">
              Expires {moment(expirationDate, "YYYYMMDD").fromNow()}
              <br />
              UPC: {upc}
              <br />
              Department: {department}
              <br />
              Quantity: {quantity}
            </Typography>
            <Box sx={{ marginLeft: "auto" }}>
              <DeleteShrinkItemButton shrinkItemId={id} />
            </Box>
          </CardActions>
        </CardContent>
      </Card>
    </div>
  );
}

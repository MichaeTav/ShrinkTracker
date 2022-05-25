import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { isMobile } from "react-device-detect";

import { useShrinkForm } from "../../util/hooks";
import { FETCH_SHRINK_ITEMS_QUERY } from "../../util/graphql";
import ItemSearchBar from "../ItemSearchBar";

export default function AddShrinkItemForm() {
  const initialState = {
    upc: "",
    item: "",
    expirationDate: null,
    quantity: "",
  };
  const [errors, setErrors] = useState({});

  const { values, onChange, onSubmit, onClose } = useShrinkForm(
    addShrinkItemCallback,
    initialState
  );

  const [addShrinkItem] = useMutation(ADD_ITEM_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_SHRINK_ITEMS_QUERY,
        variables: { values },
      });
      data.getAllShrinkItems = [
        result.data.addShrinkItem,
        ...data.getAllShrinkItems,
      ];
      proxy.writeQuery({
        query: FETCH_SHRINK_ITEMS_QUERY,
        variables: { values },
        data,
      });
      //resets form to initial values
      onClose();
    },
    onError(err) {
      console.log(err.graphQLErrors[0].extensions.exception);
      setErrors(err.graphQLErrors[0].extensions.exception);
    },
  });

  function itemSearchCallback(item) {
    values.item = item;
    values.upc = item.split(": ").pop();
  }

  function addShrinkItemCallback() {
    setErrors([]);
    addShrinkItem();
  }

  return (
    <Box
      component="form"
      sx={{
        "& .MuiTextField-root": { m: 1, width: "25ch" },
        margin: "10px",
      }}
      noValidate
      autoComplete="off"
    >
      <Stack
        direction="column"
        justifyContent="space-evenly"
        alignItems="center"
        spacing={0}
      >
        <Typography variant="h4">Add Item</Typography>
        <ItemSearchBar
          itemSearchCallback={itemSearchCallback}
          item={values.item}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {isMobile ? (
            <MobileDatePicker
              label="Shrink Date"
              inputFormat="MM/DD/yyyy"
              value={values.expirationDate}
              onChange={onChange}
              renderInput={(params) => (
                <TextField {...params} variant="standard" />
              )}
            />
          ) : (
            <DatePicker
              label="Shrink Date"
              inputFormat="MM/DD/yyyy"
              value={values.expirationDate}
              onChange={onChange}
              renderInput={(params) => (
                <TextField {...params} variant="standard" />
              )}
            />
          )}
        </LocalizationProvider>

        <TextField
          label="Quantity"
          type="number"
          variant="standard"
          value={values.quantity}
          onChange={onChange}
        />
        <Box sx={{ marginTop: "20px" }}>
          <Button variant="contained" onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}

const ADD_ITEM_MUTATION = gql`
  mutation ($upc: String!, $expirationDate: String!, $quantity: Int!) {
    addShrinkItem(
      upc: $upc
      expirationDate: $expirationDate
      quantity: $quantity
    ) {
      id
      expirationDate
      userWhoAdded
      dateAdded
      quantity
      item {
        upc
        name
        department
      }
    }
  }
`;

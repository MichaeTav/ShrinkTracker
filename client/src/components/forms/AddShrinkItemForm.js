import React, { useState, useContext } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Box, TextField, Button, Stack, Typography } from "@mui/material";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { isMobile } from "react-device-detect";

import { AuthContext } from "../../context/auth";
import { useShrinkForm } from "../../util/hooks";
import { FETCH_SHRINK_ITEMS_QUERY } from "../../util/graphql";
import ItemSearchBar from "../ItemSearchBar";

export default function AddShrinkItemForm() {
  const { userData } = useContext(AuthContext);
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
    awaitRefetchQueries: true,
    variables: values,
    update(proxy, result) {
      const department = userData.department;
      const data = proxy.readQuery({
        query: FETCH_SHRINK_ITEMS_QUERY,
        variables: { values, department },
      });
      data.getAllShrinkItems = [
        result.data.addShrinkItem,
        ...data.getAllShrinkItems,
      ];
      proxy.writeQuery({
        query: FETCH_SHRINK_ITEMS_QUERY,
        variables: { values, department },
        data,
      });
      //resets form to initial values
      onClose();
      setErrors([]);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception);
    },
  });

  function checkInputs(event) {
    if (values.expirationDate === null) values.expirationDate = "";
    if (values.quantity === "") values.quantity = 0;
    onSubmit(event);
    if (values.expirationDate === "") values.expirationDate = null;
    if (values.quantity === 0) values.quantity = "";
  }

  function itemSearchCallback(item) {
    values.item = item;
    values.upc = item.split(": ").pop();
  }

  function addShrinkItemCallback() {
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
          error={errors.item ? true : false}
          helperText={!errors.item ? "" : errors.item}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          {isMobile ? (
            <MobileDatePicker
              label="Shrink Date"
              inputFormat="MM/DD/yyyy"
              value={values.expirationDate}
              onChange={onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={errors.expirationDate ? true : false}
                  helperText={
                    !errors.expirationDate ? "" : errors.expirationDate
                  }
                  variant="standard"
                />
              )}
            />
          ) : (
            <DatePicker
              label="Shrink Date"
              inputFormat="MM/DD/yyyy"
              value={values.expirationDate}
              onChange={onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={errors.expirationDate ? true : false}
                  helperText={
                    !errors.expirationDate ? "" : errors.expirationDate
                  }
                  variant="standard"
                />
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
          error={errors.quantity ? true : false}
          helperText={!errors.quantity ? "" : errors.quantity}
        />
        <Box sx={{ marginTop: "20px" }}>
          <Button variant="contained" onClick={checkInputs}>
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

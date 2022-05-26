import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Tooltip,
  Box,
  TextField,
  Stack,
  Select,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { FETCH_ALL_ITEMS_QUERY } from "../../util/graphql.js";
import { useForm } from "../../util/hooks";

export default function AddItemButton() {
  const initialValues = {
    upc: "",
    name: "",
    department: "",
  };
  const departmentSelections = [
    { key: "p", text: "Produce", value: "Produce" },
    { key: "m", text: "Meat", value: "Meat" },
    { key: "b", text: "Bakery", value: "Bakery" },
    { key: "g", text: "Grocery", value: "Grocery" },
    { key: "d", text: "Deli", value: "Deli" },
  ];

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [errors, setErrors] = useState({});

  const { onChange, onClose, values } = useForm(addItemCallback, initialValues);

  const [addItem, { loading }] = useMutation(ADD_ITEM_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ALL_ITEMS_QUERY,
        variables: { values },
      });
      data.getAllItems = [...data.getAllItems, result.data.addItem];
      proxy.writeQuery({
        query: FETCH_ALL_ITEMS_QUERY,
        variables: { values },
        data,
      });
      values.upc = "";
      values.name = "";
      values.department = "";
      setConfirmOpen(false);
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception);
    },
  });

  //callback
  function addItemCallback() {
    addItem();
  }

  function onSelectionChange(event) {
    onChange(event);
  }

  function handleClickOpen() {
    setConfirmOpen(true);
  }

  function handleClose() {
    setErrors({});
    onClose();
    setConfirmOpen(false);
  }
  return (
    <>
      <Tooltip title="Add Item" arrow>
        <IconButton size="large" color="success" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Add New Item</DialogTitle>
        <DialogContent>
          <Box>
            <Stack
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
            >
              <TextField
                name="upc"
                label="UPC"
                type="text"
                variant="standard"
                value={values.upc}
                onChange={onChange}
                error={errors.upc ? true : false}
                helperText={!errors.upc ? "" : errors.upc}
              />
              <TextField
                name="name"
                label="Name"
                type="text"
                variant="standard"
                value={values.name}
                onChange={onChange}
                error={errors.name ? true : false}
                helperText={!errors.name ? "" : errors.name}
              />
              <FormControl
                error={errors.department ? true : false}
                variant="standard"
                fullWidth
              >
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  labelId="department-select-label"
                  name="department"
                  value={values.department}
                  onChange={onSelectionChange}
                  label="Department"
                >
                  {departmentSelections.map((department) => (
                    <MenuItem key={department.key} value={department.value}>
                      {department.text}
                    </MenuItem>
                  ))}
                </Select>
                {errors.department && (
                  <FormHelperText>{errors.department}</FormHelperText>
                )}
              </FormControl>
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addItem}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const ADD_ITEM_MUTATION = gql`
  mutation ($upc: String!, $name: String!, $department: String!) {
    addItem(upc: $upc, name: $name, department: $department) {
      id
      upc
      name
      department
    }
  }
`;

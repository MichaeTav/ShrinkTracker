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

import { useForm } from "../../util/hooks";
import { FETCH_ALL_USERS_QUERY } from "../../util/graphql";

function AddUserButton() {
  const initialValues = {
    username: "",
    password: "",
    confirmPassword: "",
    department: "",
    email: "",
    roles: [],
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

  const { onChange, onClose, values } = useForm(registerUser, initialValues);

  const [addUser, { loading }] = useMutation(ADD_USER_MUTATION, {
    variables: { inputUser: values },
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_ALL_USERS_QUERY,
        variables: { values },
      });
      data.findAllUsers = [...data.findAllUsers, result.data.createUser];
      proxy.writeQuery({
        query: FETCH_ALL_USERS_QUERY,
        variables: { values },
        data,
      });
      setConfirmOpen(false);
      setErrors({});
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception);
    },
  });

  function registerUser() {
    addUser();
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
      <Tooltip title="Add User" arrow>
        <IconButton size="large" color="success" onClick={handleClickOpen}>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Add User</DialogTitle>
        <DialogContent>
          <Box>
            <Stack
              direction="column"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
            >
              <TextField
                name="username"
                label="Name"
                type="text"
                variant="standard"
                value={values.username}
                onChange={onChange}
                error={errors.username}
                helperText={!errors.username ? "" : errors.username}
              />
              <TextField
                name="password"
                label="Password"
                type="password"
                variant="standard"
                value={values.password}
                onChange={onChange}
                error={errors.password}
                helperText={!errors.password ? "" : errors.password}
              />
              <TextField
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                variant="standard"
                value={values.confirmPassword}
                onChange={onChange}
                error={errors.confirmPassword}
                helperText={
                  !errors.confirmPassword ? "" : errors.confirmPassword
                }
              />
              <FormControl
                error={errors.department}
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
              <TextField
                name="email"
                label="Email"
                type="text"
                variant="standard"
                value={values.email}
                onChange={onChange}
                error={errors.email}
                helperText={!errors.email ? "" : errors.email}
              />
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addUser}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const ADD_USER_MUTATION = gql`
  mutation createUser($inputUser: InputUser!) {
    createUser(inputUser: $inputUser) {
      id
      username
      department
      email
    }
  }
`;

export default AddUserButton;

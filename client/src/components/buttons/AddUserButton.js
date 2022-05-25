import React, { useState } from "react";
import gql from "graphql-tag";
import { Button, Modal, Icon, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import MyPopup from "../../util/MyPopup";
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

  const { onChange, onSubmit, onClose, values } = useForm(
    registerUser,
    initialValues
  );

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
    },
    onError(err) {
      console.log(values);
      setErrors(err.graphQLErrors[0].extensions.exception);
    },
  });

  function registerUser() {
    addUser();
  }

  function closeForm() {
    onClose();
    setConfirmOpen(false);
  }
  return (
    <>
      <MyPopup content="Add User">
        <Button
          as="div"
          color="green"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="plus" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Modal open={confirmOpen} size="tiny" onClose={() => closeForm()}>
        <div className="form-container">
          <Form
            onSubmit={onSubmit}
            noValidate
            className={loading ? "loading" : ""}
          >
            <h1>Register User</h1>
            <Form.Input
              label="Username"
              placeholder="Username.."
              name="username"
              type="text"
              value={values.username}
              onChange={onChange}
            />
            <Form.Input
              label="Password"
              placeholder="Password.."
              name="password"
              type="password"
              value={values.password}
              onChange={onChange}
            />
            <Form.Input
              label="Confirm Password"
              placeholder="Confirm Password.."
              name="confirmPassword"
              type="password"
              value={values.confirmPassword}
              onChange={onChange}
            />
            <Form.Select
              label="Department"
              placeholder="Department"
              name="department"
              options={departmentSelections}
              //value={values.department}
              onChange={onChange}
            />
            <Form.Input
              label="Email"
              placeholder="Email.."
              name="email"
              type="email"
              value={values.email}
              onChange={onChange}
            />
            <Button type="submit" primary>
              Register
            </Button>
          </Form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map((value) => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
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

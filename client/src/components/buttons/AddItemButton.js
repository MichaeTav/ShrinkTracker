import React, { useState } from "react";
import gql from "graphql-tag";
import { Button, Modal, Icon, Form } from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_ALL_ITEMS_QUERY } from "../../util/graphql.js";
import MyPopup from "../../util/MyPopup";
import { useForm } from "../../util/hooks";

function AddItemButton() {
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

  const { onChange, onSubmit, onClose, values } = useForm(
    addItemCallback,
    initialValues
  );

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
      setErrors(err.graphQLErrors[0].extensions);
    },
  });

  //callback
  function addItemCallback() {
    addItem();
  }

  function closeForm() {
    onClose();
    setConfirmOpen(false);
  }
  return (
    <>
      <MyPopup content="Add New Item">
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
            <h1>Add Item</h1>
            <Form.Input
              label="UPC"
              placeholder="UPC.."
              name="upc"
              type="text"
              value={values.upc}
              onChange={onChange}
            />
            <Form.Input
              label="Name"
              placeholder="Name.."
              name="name"
              type="text"
              value={values.name}
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
            <Button type="submit" primary>
              Add Item
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

export default AddItemButton;

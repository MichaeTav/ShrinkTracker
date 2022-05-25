import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_ALL_ITEMS_QUERY } from "../../util/graphql.js";
import MyPopup from "../../util/MyPopup";

const DeleteItemButton = ({ id, callback }) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteItemMutation] = useMutation(DELETE_ITEM_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_ALL_ITEMS_QUERY,
        variables: { id },
      });
      data.getAllItems = data.getAllItems.filter((item) => item.id !== id);
      proxy.writeQuery({
        query: FETCH_ALL_ITEMS_QUERY,
        variables: { id },
        data,
      });

      if (callback) callback();
    },
    variables: {
      id,
    },
  });

  return (
    <>
      <MyPopup content="Delete Item">
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => setConfirmOpen(true)}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deleteItemMutation}
      />
    </>
  );
};

const DELETE_ITEM_MUTATION = gql`
  mutation ($id: ID!) {
    deleteItem(id: $id)
  }
`;

export default DeleteItemButton;

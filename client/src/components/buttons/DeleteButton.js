import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_SHRINK_ITEMS_QUERY } from "../../util/graphql";
import MyPopup from "../../util/MyPopup";

function DeleteButton({ shrinkItemId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteItemMutation] = useMutation(DELETE_ITEM_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_SHRINK_ITEMS_QUERY,
        variables: { shrinkItemId },
      });
      data.getAllShrinkItems = data.getAllShrinkItems.filter(
        (i) => i.id !== shrinkItemId
      );
      proxy.writeQuery({
        query: FETCH_SHRINK_ITEMS_QUERY,
        variables: { shrinkItemId },
        data,
      });

      if (callback) callback();
    },
    variables: {
      shrinkItemId,
      quantity: 20,
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
}

const DELETE_ITEM_MUTATION = gql`
  mutation ($shrinkItemId: ID!, $quantity: Int!) {
    deleteShrinkItem(id: $shrinkItemId, quantity: $quantity)
  }
`;

export default DeleteButton;

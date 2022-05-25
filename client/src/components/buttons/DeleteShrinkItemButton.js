import React, { useState } from "react";
import {
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Button,
  Tooltip,
} from "@mui/material";
import DeleteOutlined from "@mui/icons-material/Delete";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

import { FETCH_SHRINK_ITEMS_QUERY } from "../../util/graphql";

export default function DeleteShrinkItemButton({ shrinkItemId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteItemMutation] = useMutation(DELETE_ITEM_MUTATION, {
    variables: {
      shrinkItemId,
      quantity: 20,
    },
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
    },
  });

  const handleClickOpen = () => {
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setConfirmOpen(false);
  };

  return (
    <div>
      <Tooltip title="Shrink Item" arrow>
        <IconButton
          color="error"
          aria-label="Delete Shrink Item"
          onClick={handleClickOpen}
          disableTouchRipple
        >
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Do you want to shrink this item?</DialogTitle>
        <DialogContent>
          <DialogContentText>TODO: ask quantity + reason</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteItemMutation}>Shrink</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DELETE_ITEM_MUTATION = gql`
  mutation ($shrinkItemId: ID!, $quantity: Int!) {
    deleteShrinkItem(id: $shrinkItemId, quantity: $quantity)
  }
`;

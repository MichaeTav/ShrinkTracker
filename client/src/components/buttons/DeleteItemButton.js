import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
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

import { FETCH_ALL_ITEMS_QUERY } from "../../util/graphql.js";

export default function DeleteItemButton({ id, callback }) {
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

  const handleClickOpen = () => {
    setConfirmOpen(true);
  };

  const handleClose = () => {
    setConfirmOpen(false);
  };

  return (
    <div>
      <Tooltip title="Delete Item" arrow>
        <IconButton size="large" color="error" onClick={handleClickOpen}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Do you want to delete this item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Will not longer be able to access this item
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteItemMutation}>Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DELETE_ITEM_MUTATION = gql`
  mutation ($id: ID!) {
    deleteItem(id: $id)
  }
`;

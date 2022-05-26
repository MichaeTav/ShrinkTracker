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

import { FETCH_ALL_USERS_QUERY } from "../../util/graphql";

function DeleteUserButton({ id, username }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [deleteUserMutation] = useMutation(DELETE_USER_MUTATION, {
    update(proxy) {
      setConfirmOpen(false);
      const data = proxy.readQuery({
        query: FETCH_ALL_USERS_QUERY,
        variables: { id },
      });
      data.findAllUsers = data.findAllUsers.filter((user) => user.id !== id);
      proxy.writeQuery({
        query: FETCH_ALL_USERS_QUERY,
        variables: { id },
        data,
      });
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
      <Tooltip title="Remove User" arrow>
        <IconButton size="large" color="error" onClick={handleClickOpen}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
      <Dialog open={confirmOpen} onClose={handleClose}>
        <DialogTitle>Do you want to remove {username} from users?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {username} will no longer be able to access this site.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={deleteUserMutation}>Remove</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const DELETE_USER_MUTATION = gql`
  mutation ($id: String!) {
    deleteUser(id: $id)
  }
`;

export default DeleteUserButton;

// <>
//       <MyPopup content="Delete User">
//         <Button
//           as="div"
//           color="red"
//           floated="right"
//           onClick={() => setConfirmOpen(true)}
//         >
//           <Icon name="trash" style={{ margin: 0 }} />
//         </Button>
//       </MyPopup>
//       <Confirm
//         open={confirmOpen}
//         onCancel={() => setConfirmOpen(false)}
//         onConfirm={deleteUserMutation}
//       />
//     </>

import React, { useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { Button, Confirm, Icon } from "semantic-ui-react";

import { FETCH_ALL_USERS_QUERY } from "../../util/graphql";
import MyPopup from "../../util/MyPopup";

function DeleteUserButton({ id, callback }) {
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

      if (callback) callback();
    },
    variables: {
      id,
    },
  });
  return (
    <>
      <MyPopup content="Delete User">
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
        onConfirm={deleteUserMutation}
      />
    </>
  );
}

const DELETE_USER_MUTATION = gql`
  mutation ($id: String!) {
    deleteUser(id: $id)
  }
`;

export default DeleteUserButton;

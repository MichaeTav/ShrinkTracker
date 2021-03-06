import gql from "graphql-tag";

export const FETCH_SHRINK_ITEMS_QUERY = gql`
  {
    getAllShrinkItems {
      id
      userWhoAdded
      expirationDate
      quantity
      dateAdded
      item {
        name
        upc
        department
      }
    }
  }
`;

export const FETCH_ALL_USERS_QUERY = gql`
  {
    findAllUsers {
      id
      username
      email
      department
    }
  }
`;

export const FETCH_ALL_ITEMS_QUERY = gql`
  {
    getAllItems {
      id
      upc
      name
      department
    }
  }
`;

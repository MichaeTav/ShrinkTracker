import { useContext } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@apollo/react-hooks";

import { AuthContext } from "../context/auth";
import { FETCH_ALL_ITEMS_QUERY } from "../util/graphql";

export default function ItemSearchBar({
  itemSearchCallback,
  item,
  error,
  helperText,
}) {
  const { userData } = useContext(AuthContext);
  const department = userData.department;
  const { loading, data: { getAllItems: items } = {} } = useQuery(
    FETCH_ALL_ITEMS_QUERY,
    { variables: { department } }
  );
  return (
    <Autocomplete
      freeSolo
      options={loading ? [] : items.map((item) => item.name + ": " + item.upc)}
      renderInput={(params) => (
        <TextField
          error={error ? true : false}
          helperText={!error ? "" : helperText}
          {...params}
          label="Item"
          variant="standard"
        />
      )}
      value={item}
      onChange={(event, item) => {
        if (item) {
          itemSearchCallback(item);
        }
      }}
    />
  );
}

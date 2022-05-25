import { Autocomplete, TextField } from "@mui/material";
import { useQuery } from "@apollo/react-hooks";

import { FETCH_ALL_ITEMS_QUERY } from "../util/graphql";

export default function ItemSearchBar({ itemSearchCallback, item }) {
  const { loading, data: { getAllItems: items } = {} } = useQuery(
    FETCH_ALL_ITEMS_QUERY
  );
  return (
    <Autocomplete
      freeSolo
      options={loading ? [] : items.map((item) => item.name + ": " + item.upc)}
      renderInput={(params) => (
        <TextField {...params} label="Item" variant="standard" />
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

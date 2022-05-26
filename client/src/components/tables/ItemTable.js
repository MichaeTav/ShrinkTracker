import { useQuery } from "@apollo/react-hooks";
import {
  Table,
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  Paper,
} from "@mui/material";

import AddItemButton from "../buttons/AddItemButton";
import DeleteItemButton from "../buttons/DeleteItemButton";
import { FETCH_ALL_ITEMS_QUERY } from "../../util/graphql";

export default function ItemTable() {
  const { loading, data: { getAllItems: items } = {} } = useQuery(
    FETCH_ALL_ITEMS_QUERY
  );

  return (
    <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
      <Table sx={{ minWidth: 200 }}>
        <TableHead>
          <TableRow>
            <TableCell>UPC</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Department</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items &&
            items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.upc}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.department}</TableCell>
                <TableCell align="right">
                  <DeleteItemButton id={item.id} />
                </TableCell>
              </TableRow>
            ))}
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell align="right">
            <AddItemButton />
          </TableCell>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

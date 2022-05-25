import { useQuery } from "@apollo/react-hooks";
import { Table } from "semantic-ui-react";

import AddItemButton from "./buttons/AddItemButton";
import DeleteItemButton from "./buttons/DeleteItemButton";
import { FETCH_ALL_ITEMS_QUERY } from "../util/graphql";

function ItemTable() {
  const { loading, data: { getAllItems: items } = {} } = useQuery(
    FETCH_ALL_ITEMS_QUERY
  );

  return (
    <>
      {loading ? (
        <h1>Loading Items...</h1>
      ) : (
        <Table selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>UPC</Table.HeaderCell>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Department</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items &&
              items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>{item.upc}</Table.Cell>
                  <Table.Cell>{item.name}</Table.Cell>
                  <Table.Cell>{item.department}</Table.Cell>
                  <Table.Cell>
                    <DeleteItemButton id={item.id} />
                  </Table.Cell>
                </Table.Row>
              ))}
            <Table.Row selectable="false">
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell>
                <AddItemButton />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )}
    </>
  );
}

export default ItemTable;

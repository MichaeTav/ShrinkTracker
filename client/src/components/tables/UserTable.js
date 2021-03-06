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

import AddUserButton from "../buttons/AddUserButton";
import DeleteUserButton from "../buttons/DeleteUserButton";
import { FETCH_ALL_USERS_QUERY } from "../../util/graphql";

function UserTable() {
  const { loading, data: { findAllUsers: users } = {} } = useQuery(
    FETCH_ALL_USERS_QUERY
  );

  return (
    <TableContainer component={Paper} sx={{ marginTop: "10px" }}>
      <Table sx={{ minWidth: 200 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Department</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users &&
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.department}</TableCell>
                <TableCell align="right">
                  <DeleteUserButton id={user.id} username={user.username} />
                </TableCell>
              </TableRow>
            ))}
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell align="right">
              <AddUserButton />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default UserTable;

// <>
//       {loading ? (
//         <h1>Loading Users...</h1>
//       ) : (
//         <Table selectable>
//           <Table.Header>
//             <Table.Row>
//               <Table.HeaderCell>Name</Table.HeaderCell>
//               <Table.HeaderCell>Email</Table.HeaderCell>
//               <Table.HeaderCell>Department</Table.HeaderCell>
//               <Table.HeaderCell></Table.HeaderCell>
//             </Table.Row>
//           </Table.Header>

//           <Table.Body>
//             {users &&
//               users.map((user) => (
//                 <Table.Row key={user.id}>
//                   <Table.Cell>{user.username}</Table.Cell>
//                   <Table.Cell>{user.email}</Table.Cell>
//                   <Table.Cell>{user.department}</Table.Cell>
//                   <Table.Cell>
//                     <DeleteUserButton id={user.id} />
//                   </Table.Cell>
//                 </Table.Row>
//               ))}
//             <Table.Row selectable="false">
//               <Table.Cell></Table.Cell>
//               <Table.Cell></Table.Cell>
//               <Table.Cell></Table.Cell>
//               <Table.Cell>
//                 <AddUserButton />
//               </Table.Cell>
//             </Table.Row>
//           </Table.Body>
//         </Table>
//       )}
//     </>

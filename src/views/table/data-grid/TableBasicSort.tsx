import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DataGrid,
  GridColDef,
} from '@mui/x-data-grid';
import {
  Card,
  CardHeader,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

// Define the User interface for the original data structure
interface User {
  id: number; // You can omit this if you're generating the ID
  firstName: string;
  lastName: string;
  phone: string;
  address: string; // Adjust based on actual structure
}

// Define the TransformedUser interface for the transformed data structure
interface TransformedUser {
  id: number;
  arrivalDate: string;
  fullName: string;
  phone: string;
  courseType: string;
  weekDays: string;
  courseLanguage: string;
  time: string;
  occupation: string;
  address: string;
}

// Define the TableSort component
const TableSort = () => {
  const [data, setData] = useState<TransformedUser[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 });
  const [editUser, setEditUser] = useState<TransformedUser | null>(null);
  const [open, setOpen] = useState(false);
  const [toastOpen, setToastOpen] = useState(false); // State for toast notification
  const [filter, setFilter] = useState({ arrivalDate: '', fullName: '' }); // State for filters

  // Fetch the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<{ users: User[] }>('https://dummyjson.com/users');
        const transformedData = response.data.users.map((user, index) => ({
          id: index + 1,
          arrivalDate: new Date().toLocaleDateString(),
          fullName: `${user.firstName} ${user.lastName}`,
          phone: `+998-90-500-50-05`,
          courseType: 'FrontEnd',
          weekDays: 'Dushanba, Chorshanba, Payshanba',
          courseLanguage: 'O\'zbek',
          time: '18:00',
          occupation: 'Student',
          address: 'Samarkand',
        }));
        setData(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  // Define the delete function
  const handleDelete = (id: number) => {
    setData((prevData) => {
      const newData = prevData.filter((user) => user.id !== id);
      setToastOpen(true); // Open the toast notification
      return newData;
    });
  };

  // Define the edit function
  const handleEdit = (user: TransformedUser) => {
    setEditUser(user);
    setOpen(true); // Open the edit dialog
  };

  // Handle edit form submission
  const handleEditSubmit = () => {
    if (editUser) {
      setData((prevData) =>
        prevData.map((user) => (user.id === editUser.id ? editUser : user))
      );
    }
    setOpen(false); // Close the edit dialog
    setEditUser(null); // Reset edit user
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  // Define the columns for the DataGrid
  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'arrivalDate', headerName: 'Kelgan Sanasi', width: 150 },
    { field: 'fullName', headerName: 'Ism va Familiya', flex: 1, minWidth: 150 },
    { field: 'phone', headerName: 'Telefon Raqami', width: 170 },
    { field: 'courseType', headerName: 'Kurs Turi', width: 150 },
    { field: 'weekDays', headerName: 'Hafta Kunlari', width: 260 },
    { field: 'courseLanguage', headerName: 'Kurs Tili', width: 120 },
    { field: 'time', headerName: 'Vaqti', width: 130 },
    { field: 'occupation', headerName: 'Faoliyat', width: 130 },
    { field: 'address', headerName: 'Yashash Manzili', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon color="primary" />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon color="error" />
          </IconButton>
        </>
      ),
    },
  ];

  // Filter the data based on filters
  const filteredData = data.filter(user => {
    return (
      (filter.arrivalDate ? user.arrivalDate.includes(filter.arrivalDate) : true) &&
      (filter.fullName ? user.fullName.toLowerCase().includes(filter.fullName.toLowerCase()) : true)
    );
  });

  // Render the DataGrid component
  return (
    <Card>
      <CardHeader title='O`quvchilar' />
      <DataGrid
        autoHeight
        rows={filteredData}
        columns={columns}
        pageSizeOptions={[7, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      {/* Edit User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {editUser && (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Full Name"
                fullWidth
                value={editUser.fullName}
                onChange={(e) => setEditUser({ ...editUser, fullName: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Phone"
                fullWidth
                value={editUser.phone}
                onChange={(e) => setEditUser({ ...editUser, phone: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Address"
                fullWidth
                value={editUser.address}
                onChange={(e) => setEditUser({ ...editUser, address: e.target.value })}
              />
              {/* Add other fields as necessary */}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSubmit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={() => setToastOpen(false)}>
        <Alert onClose={() => setToastOpen(false)} severity="error" sx={{ width: '100%' }}>
          Muvaffaqiyatli o'chirildi!
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default TableSort;

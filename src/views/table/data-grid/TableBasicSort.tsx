import { useState, useEffect, MouseEvent } from 'react';
import axios from 'axios';
import {
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Card,
  CardHeader,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material';
import { DataGrid, GridColDef, GridDeleteIcon, GridRowSelectionModel } from '@mui/x-data-grid';
import { Icon } from '@iconify/react';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
}

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

const TableSort = () => {
  const [data, setData] = useState<TransformedUser[]>([]);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 });
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([]);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

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
          courseLanguage: "O'zbek",
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

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleDelete = () => {
    setConfirmOpen(true);
    handleMenuClose(); // Close menu after clicking delete
  };

  const confirmDelete = () => {
    setData((prevData) =>
      prevData.filter((user) => !selectedIds.includes(user.id))
    );
    setToastMessage('Selected users deleted successfully!');
    setToastSeverity('success');
    setToastOpen(true);
    setConfirmOpen(false);
    setSelectedIds([]);
  };

  const cancelDelete = () => {
    setConfirmOpen(false);
  };

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
  ];

  return (
    <Card>
      <Grid container alignItems="center" padding={2}>
        {/* Header Title */}
        <Grid item xs>
          <CardHeader title="O`quvchilar" />
        </Grid>

        {/* Three-Dot Menu */}
        <Grid item>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleDelete} disabled={selectedIds.length === 0}>
             O'chirish  <GridDeleteIcon/>
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>Option 2</MenuItem>
            <MenuItem onClick={handleMenuClose}>Option 3</MenuItem>
          </Menu>
        </Grid>
      </Grid>

      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection)}
        pageSizeOptions={[7, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Siz rostan ham bu o'quvchini o'chirmoqchimisiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color="primary">
            Yo'q
          </Button>
          <Button onClick={confirmDelete} color="error" autoFocus>
            Xa
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Notification */}
      <Snackbar
        open={toastOpen}
        autoHideDuration={6000}
        onClose={() => setToastOpen(false)}
      >
        <Alert
          onClose={() => setToastOpen(false)}
          severity={toastSeverity}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default TableSort;

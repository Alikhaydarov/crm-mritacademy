import { useState, useEffect, MouseEvent } from 'react';
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
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import axiosClient from 'src/configs/axios'; // axiosClient ni import qiling
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

  // Backenddan ma'lumotlarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/receptions');
        console.log('Backenddan qaytgan ma`lumot:', response.data);

        // Faqat results massivini qayta ishlash
        const transformedData = response.data.results.map((user: any) => ({
          id: user.id || Math.random(), // Agar id bo'lmasa, random id berish
          arrivalDate: user.created_at || new Date().toLocaleDateString(),
          fullName: `${user.full_name || ''} ${user.last_name || ''}`,
          phone: user.phone_number1 || 'Noma’lum',
          courseType: user.course_type || 'Frontend',
          weekDays: user.week_days || 'Dushanba, Chorshanba, Payshanba',
          courseLanguage: user.course_language || "O'zbek",
          time: user.lesson_time.time_slot || '18:00',
          occupation: user.activity || 'Talaba', // activity dan foydalanamiz
          address: user.address || 'Samarkand',
        }));

        setData(transformedData);
      } catch (error) {
        console.error('Ma`lumotni olishda xatolik:', error);
        setToastSeverity('error');
        setToastOpen(true);
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
    handleMenuClose(); // Menu yopiladi
  };

  const confirmDelete = async () => {
    try {
      const response = await axiosClient.post('/receptions/', {
        ids: selectedIds, // Make sure selectedIds is an array
      });
      console.log('Delete successful:', response.data);
      setData((prevData) => prevData.filter((user) => !selectedIds.includes(user.id)));
      setToastMessage('Tanlangan foydalanuvchilar o`chirildi!');
      setToastSeverity('success');
      setToastOpen(true);
      setConfirmOpen(false);
      setSelectedIds([]);
    } catch (error) {
      console.error('Error while deleting:', error);
      setToastMessage('O`chirishda xatolik yuz berdi');
      setToastSeverity('error');
      setToastOpen(true);
    }
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
        <Grid item xs>
          <CardHeader title="O`quvchilar" />
        </Grid>
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
              O'chirish
            </MenuItem>
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
      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>O`chirishni tasdiqlash</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Siz rostan ham tanlangan foydalanuvchilarni o'chirmoqchimisiz?
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

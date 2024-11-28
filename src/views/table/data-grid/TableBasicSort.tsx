import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Alert,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Snackbar,
  TextField
} from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { MouseEvent, useEffect, useState } from 'react'
import axiosClient from 'src/configs/axios' // axiosClient ni import qiling

interface TransformedUser {
  id: number
  arrivalDate: string
  fullName: string
  phone: string
  courseType: string
  weekDays: string
  courseLanguage: string
  time: string
  occupation: string
  address: string
}

const TableSort = () => {
  const [data, setData] = useState<TransformedUser[]>([])
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 7 })
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState<'success' | 'error'>('success')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editData, setEditData] = useState<TransformedUser | null>(null)
  const [selectedIds, setSelectedIds] = useState<GridRowSelectionModel>([])
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  // Backenddan ma'lumotlarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/receptions');
        const transformedData = response.data.results.map((user: any, index: number) => ({
          id: user.id || index + 1,
          arrivalDate: user.created_at || new Date().toLocaleDateString(),
          fullName: `${user.full_name || ''} ${user.last_name || ''}`,
          phone: user.phone_number1 || 'Noma’lum',
          courseType: user.course_type || 'Frontend',
          weekDays: user.week_days || 'Dushanba, Chorshanba, Payshanba',
          courseLanguage: user.course_language || "O'zbek",
          time: user.lesson_time?.time_slot || '18:00',
          occupation: user.activity || 'Talaba',
          address: user.address || 'Samarkand'
        }));

        setData(transformedData);
      } catch (error) {
        console.error('Ma`lumotni olishda xatolik:', error);
        setToastSeverity('error');
        setToastOpen(true);
      }
    };

    fetchData();

    const handleReceptionAdded = () => {
      fetchData();
    };

    // Tinglovchi qo'shish
    window.addEventListener('reception-added', handleReceptionAdded);

    // Tinglovchini olib tashlash
    return () => {
      window.removeEventListener('reception-added', handleReceptionAdded);
    };
  }, []);


  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget)
  }

  const handleMenuClose = () => {
    setMenuAnchor(null)
  }

  const handleDelete = () => {
    setConfirmOpen(true)
    handleMenuClose() // Menu yopiladi
  }

  const confirmDelete = async () => {
    try {
      // Har bir ID uchun delete so'rov yuboramiz
      await Promise.all(
        selectedIds.map(async id => {
          await axiosClient.delete(`/receptions/${id}/`)
        })
      )

      // Muvaffaqiyatli bajarilganidan keyin tanlanganlarni o'chiramiz
      setData(prevData => prevData.filter(user => !selectedIds.includes(user.id)))
      setToastMessage('Tanlangan foydalanuvchilar o`chirildi!')
      setToastSeverity('success')
      setToastOpen(true)
      setConfirmOpen(false)
      setSelectedIds([]) // Tanlangan ID larni tozalaymiz
    } catch (error) {
      console.error('O`chirishda xatolik yuz berdi:', error)
      setToastMessage('O`chirishda xatolik yuz berdi')
      setToastSeverity('error')
      setToastOpen(true)
    }
  }

  const cancelDelete = () => {
    setConfirmOpen(false)
  }

  const handleEdit = (selectedIds: GridRowSelectionModel) => {
    const selectedId = selectedIds[0] // Tanlangan birinchi ID
    const userToEdit = data.find(user => user.id === selectedId)
    if (userToEdit) {
      setEditData(userToEdit)
      setEditOpen(true)
    }
  }
  interface TransformedUser {
    id: number
    arrivalDate: string
    fullName: string
    phone: string
    courseType: 'Frontend' | 'Backend' | 'Design' // Restrict to specific string values
    weekDays: string
    courseLanguage: string
    time: string
    occupation: string
    address: string
  }

  const saveEdit = async () => {
    if (!editData) return

    try {
      // Replace `course` with the correct ID, assuming `editData.courseType` contains the course name and you have a mapping for it
      const courseIdMapping = {
        Frontend: 1, // example course ID for 'Frontend'
        Backend: 2, // example course ID for 'Backend'
        Design: 3 // example course ID for 'Design'
      }

      const courseId = courseIdMapping[editData.courseType] || 0 // Default to 0 if courseType is not found in the mapping

      await axiosClient.put(`/receptions/${editData.id}/`, {
        full_name: editData.fullName,
        phone_number1: editData.phone,
        phone_number2: editData.phone, // Another phone field if needed
        course: courseId, // Send the correct course ID
        week_days: editData.weekDays,
        course_language: editData.courseLanguage === 'uz' ? 'uz' : 'ru',
        lesson_time: { time_slot: editData.time },
        birth_year: 2000,
        address: editData.address,
        status: 'online',
        activity: editData.occupation
      })

      // Update state after successful save
      setData(prevData => prevData.map(user => (user.id === editData.id ? { ...user, ...editData } : user)))

      setToastMessage('Foydalanuvchi ma`lumotlari muvaffaqiyatli yangilandi!')
      setToastSeverity('success')
      setToastOpen(true)
      setEditOpen(false)
    } catch (error) {
      console.error('Tahrirlashda xatolik yuz berdi:', error)
      setToastMessage('Tahrirlashda xatolik yuz berdi')
      setToastSeverity('error')
      setToastOpen(true)
    }
  }

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
    { field: 'address', headerName: 'Yashash Manzili', width: 200 }
  ]

  return (
    <Card>
      <Grid container alignItems='center' padding={2}>
        <Grid item xs>
          <CardHeader title='O`quvchilar' />
        </Grid>
        <Grid item>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={handleMenuClose}>
            <MenuItem onClick={handleDelete} disabled={selectedIds.length === 0}>
              O'chirish
            </MenuItem>
            <MenuItem
              onClick={() => handleEdit(selectedIds)}
              disabled={selectedIds.length !== 1} // Faqat 1 element tanlangan bo'lsa ishlaydi
            >
              Tahrirlash
            </MenuItem>
          </Menu>
        </Grid>
      </Grid>
      <DataGrid
        autoHeight
        rows={data}
        columns={columns}
        checkboxSelection
        onRowSelectionModelChange={newSelection => setSelectedIds(newSelection)}
        pageSizeOptions={[7, 10, 25]}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
      />
      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>O`chirishni tasdiqlash</DialogTitle>
        <DialogContent>
          <DialogContentText>Siz rostan ham tanlangan foydalanuvchilarni o'chirmoqchimisiz?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} color='primary'>
            Bekor qilish
          </Button>
          <Button onClick={confirmDelete} color='primary'>
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Foydalanuvchi Ma'lumotlarini Tahrirlash</DialogTitle>
        <DialogContent>
          {editData && (
            <>
              <TextField
                label='Ism va Familiya'
                fullWidth
                value={editData.fullName}
                onChange={e => setEditData(prev => (prev ? { ...prev, fullName: e.target.value } : prev))}
                margin='normal'
              />
              <TextField
                label='Telefon'
                fullWidth
                value={editData.phone}
                onChange={e => setEditData(prev => (prev ? { ...prev, phone: e.target.value } : prev))}
                margin='normal'
              />
              <TextField
                label='Kurs Tili'
                fullWidth
                value={editData.courseLanguage}
                onChange={e => setEditData(prev => (prev ? { ...prev, courseLanguage: e.target.value } : prev))}
                margin='normal'
              />
              <TextField
                label='Hafta Kunlari'
                fullWidth
                value={editData.weekDays}
                onChange={e => setEditData(prev => (prev ? { ...prev, weekDays: e.target.value } : prev))}
                margin='normal'
              />
              <TextField
                label='Vaqti'
                fullWidth
                value={editData.time}
                onChange={e => setEditData(prev => (prev ? { ...prev, time: e.target.value } : prev))}
                margin='normal'
              />
              <TextField
                label='Manzil'
                fullWidth
                value={editData.address}
                onChange={e => setEditData(prev => (prev ? { ...prev, address: e.target.value } : prev))}
                margin='normal'
              />
              <TextField
                label='Faoliyat'
                fullWidth
                value={editData.occupation}
                onChange={e => setEditData(prev => (prev ? { ...prev, occupation: e.target.value } : prev))}
                margin='normal'
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)} color='primary'>
            Bekor qilish
          </Button>
          <Button onClick={saveEdit} color='primary'>
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={toastOpen} autoHideDuration={6000} onClose={() => setToastOpen(false)}>
        <Alert severity={toastSeverity} onClose={() => setToastOpen(false)}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Card>
  )
}

export default TableSort

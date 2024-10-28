'use client'

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import CustomChip from 'src/@core/components/mui/chip';
import Typography from '@mui/material/Typography'; // Make sure this is imported
import { ThemeColor } from 'src/@core/layouts/types';
import { useEffect, useState } from 'react';
import axios from 'axios';

// ** Statuslar
const statusObj: { [key: string]: { title: string; color: ThemeColor } } = {
  ongoing: { title: 'O‘qiyapti', color: 'warning' },
  completed: { title: 'Tugallangan', color: 'success' },
  in_process: { title: 'Jarayonda', color: 'info' },
};

// ** User Interface
interface User {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
}

// ** O'quvchilar jadvali
interface Student {
  id: number;
  full_name: string;
  phone: string;
  status: { title: string; color: ThemeColor };
  enrollmentDate: string;
}

const StudentTable = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>(''); // Status filter
  const [dateFilter, setDateFilter] = useState<string>(''); // Date filter

  useEffect(() => {
    const fetchStudents = async () => {
      const allStudents: Student[] = [];
      const totalRequests = 4; // Fetching 100 users

      for (let i = 0; i < totalRequests; i++) {
        const res = await axios.get(`https://dummyjson.com/users?limit=30&skip=${i * 30}`);
        const users: User[] = res.data.users;

        const studentsData = users.map((user: User) => ({
          id: user.id,
          full_name: `${user.firstName} ${user.lastName}`,
          phone: user.phone,
          status: statusObj[Object.keys(statusObj)[Math.floor(Math.random() * Object.keys(statusObj).length)]],
          enrollmentDate: new Date().toLocaleDateString(),
        }));

        allStudents.push(...studentsData);
      }

      setStudents(allStudents);
    };

    fetchStudents();
  }, []);

  const handleDelete = () => {
    setStudents(prev => prev.filter(student => !selectedIds.includes(student.id)));
    setSelectedIds([]);
  };

  // Filtering logic based on search term, status, and enrollment date
  const filteredStudents = students.filter(student => {
    const matchesSearchTerm = student.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || student.phone.includes(searchTerm);
    const matchesStatus = statusFilter ? student.status.title === statusFilter : true;
    const matchesDate = dateFilter ? student.enrollmentDate === dateFilter : true;

    return matchesSearchTerm && matchesStatus && matchesDate;
  });

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'full_name',
      headerName: 'Ism',
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant='body2'>{params.row.full_name}</Typography>
        </Box>
      ),
    },
    { field: 'phone', headerName: 'Telefon', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      flex: 1,
      renderCell: (params) => (
        <CustomChip
          label={params.row.status.title}
          color={params.row.status.color}
          sx={{ '& .MuiChip-label': { textTransform: 'capitalize' } }}
        />
      ),
    },
    { field: 'enrollmentDate', headerName: 'Kelgan Vaqti', flex: 1 },
  ];

  return (
    <Card>
      <CardHeader
        title="O'quvchilar"
        action={
          <Button
            size='small'
            variant='contained'
            color='error'
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
          >
            O'chirish
          </Button>
        }
      />
      <Box sx={{ p: 2 }}>
        {/* Search Input */}
        <TextField
          label="Qidirish..."
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          margin="normal"
        />
        {/* Status Filter */}
        <TextField
          label="Statusni tanlang"
          select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          fullWidth
          margin="normal"
          SelectProps={{
            native: true,
          }}
        >
          <option value="">Barchasi</option>
          {Object.entries(statusObj).map(([key, { title }]) => (
            <option key={key} value={title}>{title}</option>
          ))}
        </TextField>
        {/* Enrollment Date Filter */}
        <TextField
          label="Kelgan vaqtni tanlang"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true,
          }}
        />
      </Box>
      <Box sx={{ minHeight: '400px', height: 'auto', width: '100%', overflow: 'auto' }}>
        <DataGrid
          autoHeight
          rows={filteredStudents} // Use filtered students
          columns={columns}
          checkboxSelection
          onRowSelectionModelChange={(newSelection) => setSelectedIds(newSelection as number[])}
          sx={{ '& .MuiDataGrid-root': { overflow: 'hidden' } }}
        />
      </Box>
    </Card>
  );
}

export default StudentTable;

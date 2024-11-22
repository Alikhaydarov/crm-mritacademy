import { Fab } from '@mui/material'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Icon from 'src/@core/components/icon'
import axiosClient from 'src/configs/axios'
import FormLayoutsCollapsible from 'src/views/forms/form-layouts/FormLayoutsCollapsible'
import TableBasicSort from 'src/views/table/data-grid/TableBasicSort'

function Index() {
  const [onMenu, setOnMenu] = useState<boolean>(false)
  const [showFilters, setShowFilters] = useState<boolean>(false)
  const [file, setFile] = useState<File | null>(null) // State for storing the uploaded file

  // Function to handle file change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }
  const [teachers, setTeachers] = useState<[]>([])
  const [data, setData] = useState<[]>([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/courses')
        const names = response.data.map((item: { name: string }) => item.name)
        setData(response.data.map((item: { name: string }) => item.name))
      } catch (error) {
        console.error('Ma`lumotni olishda xatolik:', error)
      }
    }
    fetchData()
  }, [])

  // useEffect(() => {
  //   const fetchTeachers = async () => {
  //     try {
  //       const response = await axiosClient.get('lesson_times/')
  //       setTeachers(response.data)

  //       console.log(teachers, "time")
  //     } catch (error) {
  //       console.error('Ma`lumotni olishda xatolik:', error)
  //     }
  //   }

  //   fetchTeachers()
  // }, [])

  // Function to handle file upload
  const handleFileUpload = async () => {
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        console.log('File uploaded successfully:', response.data)
        setFile(null) // Reset file after upload
      } catch (error) {
        console.error('Error uploading file:', error)
      }
    } else {
      console.log('Please select a file first')
    }
  }

  return (
    <div>
      <Grid container spacing={8}>
        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(8)} !important` }}></Grid>

        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
          {/* Aligning the Fab buttons to the right with spacing */}
          <Grid container justifyContent='flex-end' spacing={2}>
            <Grid item>
              <Fab
                onClick={() => setOnMenu(prevState => !prevState)}
                color='primary'
                variant='extended'
                sx={{ '& svg': { mr: 1 } }}
              >
                {onMenu ? <Icon icon='tabler:x' /> : <Icon icon='tabler:plus' />}
                {onMenu ? 'Close' : 'Add'}
              </Fab>
            </Grid>
            <Grid item>
       
            </Grid>
            <Grid item>
              <input
                accept='.xlsx, .xls' // Accept only Excel files
                style={{ display: 'none' }}
                id='upload-excel-file'
                type='file'
                onChange={handleFileChange}
              />
              <label htmlFor='upload-excel-file'>
                <Fab
                  color='default'
                  variant='extended'
                  sx={{
                    '& svg': { mr: 1 }
                  }}
                  onClick={handleFileUpload}
                >
                  <Icon icon='tabler:upload' />
                </Fab>
              </label>
            </Grid>
          </Grid>

          <br />
          <br />

          {onMenu && <FormLayoutsCollapsible />}
        </Grid>
      </Grid>

      <br />

      <TableBasicSort />
    </div>
  )
}

export default Index

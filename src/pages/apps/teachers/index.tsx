"use client"
import React, { useEffect, useState } from 'react'
import { Grid, Typography, Button, Box } from '@mui/material'
import axiosClient from 'src/configs/axios'
import CardUser from 'src/views/ui/cards/basic/CardUser'

const Index = () => {
  const [teachers, setTeachers] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('/teachers')
        setTeachers(Array.isArray(response.data.results) ? response.data.results : [])
        console.log(response.data.results)
      } catch (error) {
        console.error('Error fetching teachers:', error)
      }
    }

    fetchData()
  }, [])

  const handleAddTeacher = () => {
    // Placeholder function for adding a teacher
    console.log('Add Teacher button clicked!')
  }

  return (
    <div>
      {/* Add Teacher Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5">Teachers</Typography>
        <Button variant="contained" onClick={handleAddTeacher}>
          Add Teacher
        </Button>
      </Box>

      {/* Teachers Grid */}
      <Grid container spacing={6}>
        {teachers.length > 0 ? (
          teachers.map((teacher) => (
            <Grid item xs={12} sm={6} md={4} key={teacher.id}>
              <CardUser
                fullname={teacher.fullname}
                profession={teacher.profession}
                profile_image={teacher.profile_image}
                joined_date={teacher.joined_date}
                phone_number={teacher.phone_number}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', width: '100%' }}>
            No teachers found.
          </Typography>
        )}
      </Grid>
    </div>
  )
}

export default Index

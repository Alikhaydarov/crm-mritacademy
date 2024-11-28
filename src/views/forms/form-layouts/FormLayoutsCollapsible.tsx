import { ChangeEvent, useEffect, useState } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import axiosClient from 'src/configs/axios'

const FormLayoutsCollapsible = () => {
  // ** States
  const [fullName, setFullName] = useState<string>('')
  const [phoneNumber1, setPhoneNumber1] = useState<string>('')
  const [phoneNumber2, setPhoneNumber2] = useState<string | null>(null)
  const [course, setCourse] = useState<number | string>('') // Allow string or number
  const [weekDays, setWeekDays] = useState<string>('')
  const [courseLanguage, setCourseLanguage] = useState<string>('+bek') // Ensure correct value for backend
  const [lessonTime, setLessonTime] = useState<string>('') // Default to an empty string
  const [birthYear, setBirthYear] = useState<string>('')
  const [address, setAddress] = useState<string>('')
  const [status, setStatus] = useState<string>('active') // Ensure correct value for backend
  const [activity, setActivity] = useState<string>('')

  // Validation uchun error states
  const [errors, setErrors] = useState({
    fullName: false,
    phoneNumber1: false,
    phoneNumber2: false,
    address: false,
    status: false,
    birthYear: false,
    weekDays: false
  })
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // Backenddan olinadigan dinamik ma'lumotlar
  const [languagesData, setLanguagesData] = useState<{ id: string; name: string }[]>([])
  const [statusesData, setStatusesData] = useState<{ id: string; name: string }[]>([])
  const [coursesData, setCoursesData] = useState<{ id: number; name: string }[]>([]) // Ensure correct type for courses
  const [lessonTimesData, setLessonTimesData] = useState<{ id: string; time_slot: string }[]>([])

  // Backenddan ma'lumotlarni olish uchun useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonResponse, coursesResponse] = await Promise.all([
          axiosClient.get('lesson_times/'),
          axiosClient.get('/courses/')
        ])
        setLessonTimesData(lessonResponse.data.results) // This is correct, fetching lesson times
        setCoursesData(coursesResponse.data)
        console.log(lessonResponse.data.results)
      } catch (error) {
        console.error('Dinamik ma`lumotlarni olishda xatolik:', error)
      }
    }
    fetchData()
  }, [])

  // Validation funksiyasi
  const validateForm = () => {
    const newErrors = {
      fullName: fullName.trim() === '',
      phoneNumber1: phoneNumber1.trim() === '',
      phoneNumber2: phoneNumber2 ? phoneNumber2.trim() === '' : false, // Validate phoneNumber2 if provided
      address: address.trim() === '',
      status: status === '',
      birthYear: !/^\d{4}$/.test(birthYear.trim()),
      weekDays: weekDays.trim() === ''
    }
    setErrors(newErrors)
    return !Object.values(newErrors).includes(true)
  }

  const handleSuccess = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage(null) // Hide the message after 3 seconds
    }, 3000)
  }
  // Formani yuborish funksiyasi
  const handleSubmit = async () => {
    if (!validateForm()) return

    const newReception = {
      full_name: fullName,
      phone_number1: phoneNumber1,
      phone_number2: phoneNumber2 || '',
      course: course,
      week_days: weekDays,
      course_language: courseLanguage,
      lesson_time: lessonTime, // Send only the selected lesson time ID
      birth_year: parseInt(birthYear, 10),
      address,
      status,
      activity,
      arrival_time: new Date().toISOString().split('T')[0]
    }

    try {
      const response = await axiosClient.post('/receptions/', newReception)
      handleSuccess("O'quvchi muvaffaqiyatli qo'shildi!")

      // Sahifadan ma'lumotlarni qayta yuklash uchun trigger
      if (typeof window !== 'undefined') {
        const event = new Event('reception-added')
        window.dispatchEvent(event) // Yangi o'quvchi qo'shilganini bildirish
      }

      // Formni reset qilish
      setFullName('')
      setPhoneNumber1('')
      setPhoneNumber2(null)
      setCourse('')
      setWeekDays('')
      setCourseLanguage('uzbek')
      setLessonTime('')
      setBirthYear('')
      setAddress('')
      setStatus('active')
      setActivity('')
      setErrors({
        fullName: false,
        phoneNumber1: false,
        phoneNumber2: false,
        address: false,
        status: false,
        birthYear: false,
        weekDays: false
      })
    } catch (error: any) {
      console.error("Ma'lumotni yuborishda xatolik:", error)
    }
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Divider />
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Ism Familiya'
            placeholder='Ism Familiya'
            value={fullName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
            error={errors.fullName}
            helperText={errors.fullName ? "Ism Familiya maydoni to'ldirilishi shart" : ''}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Tug'ilgan yil"
            placeholder='YYYY'
            value={birthYear}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setBirthYear(e.target.value)}
            error={errors.birthYear}
            helperText={errors.birthYear ? "Tug'ilgan yil noto'g'ri formatda" : ''}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Hafta kunlari'
            placeholder='Dushanba, Seshanba...'
            value={weekDays}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setWeekDays(e.target.value)}
            error={errors.weekDays}
            helperText={errors.weekDays ? "Hafta kunlari maydoni to'ldirilishi shart" : ''}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='course-label'>Kurs</InputLabel>
            <Select
              value={course} // Ensure course is either a string (empty) or a number (course ID)
              onChange={(e: SelectChangeEvent<number | string>) => setCourse(e.target.value)} // Allow either string or number
              labelId='course-label'
              required
            >
              {coursesData.map(course => (
                <MenuItem key={course.id} value={course.id}>
                  {' '}
                  {/* Use course id */}
                  {course.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='lessonTime-label'>Dars vaqti</InputLabel>
            <Select
              value={lessonTime}
              onChange={(e: SelectChangeEvent<string>) => setLessonTime(e.target.value)}
              labelId='lessonTime-label'
            >
              {lessonTimesData.map(time => (
                <MenuItem key={time.id} value={time.id}>
                  {time.time_slot} {/* Display the time_slot text */}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Telefon raqami 1'
            placeholder='Telefon raqami'
            value={phoneNumber1}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber1(e.target.value)}
            error={errors.phoneNumber1}
            helperText={errors.phoneNumber1 ? 'Telefon raqami 1 majburiy' : ''}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Telefon raqami 2'
            placeholder='Telefon raqami 2'
            value={phoneNumber2 || ''}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPhoneNumber2(e.target.value)}
            error={errors.phoneNumber2}
            helperText={errors.phoneNumber2 ? "Telefon raqami 2 noto'g'ri" : ''}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Manzil'
            placeholder='Manzil'
            value={address}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAddress(e.target.value)}
            error={errors.address}
            helperText={errors.address ? "Manzil maydoni to'ldirilishi shart" : ''}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='status-label'>Status</InputLabel>
            <Select
              value={status}
              onChange={(e: SelectChangeEvent<string>) => setStatus(e.target.value)}
              labelId='status-label'
            >
              <MenuItem value='online'>Online</MenuItem>
              <MenuItem value='offline'>Offline</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel id='course-language-label'>Kurs Tili</InputLabel>
            <Select
              value={courseLanguage}
              onChange={(e: SelectChangeEvent<string>) => setCourseLanguage(e.target.value)}
              labelId='course-language-label'
            >
              <MenuItem value='uz'>Uzbek</MenuItem>
              <MenuItem value='rus'>Russian</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label='Faoliyat' // Faoliyat input maydoni
            placeholder='Faoliyatni kiriting'
            value={activity}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setActivity(e.target.value)} // value ni o'zgartirish
          />
        </Grid>
        <br />
        <Grid
          item
          xs={1}
          sx={{
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            marginLeft: { xs: '2rem', sm: '35.7rem' }, // Adjust margin for mobile
            padding: '10px 1px'
          }}
        >
          <Button fullWidth variant='contained' onClick={handleSubmit}>
            Yuborish
          </Button>
        </Grid>
      </Grid>
      <br />
      {successMessage && (
        <Typography variant='body1' color='success.main' align='center'>
          {successMessage}
        </Typography>
      )}
    </form>
  )
}

export default FormLayoutsCollapsible

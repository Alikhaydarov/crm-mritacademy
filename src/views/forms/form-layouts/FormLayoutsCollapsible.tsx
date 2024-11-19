import { ChangeEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import Accordion from '@mui/material/Accordion'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import { SelectChangeEvent } from '@mui/material/Select'

const FormLayoutsCollapsible = () => {
  // ** States
  const [fullName, setFullName] = useState<string>('')
  const [phoneNumber1, setPhoneNumber1] = useState<string>('')
  const [phoneNumber2, setPhoneNumber2] = useState<string>('')
  const [course, setCourse] = useState<number | string>('')
  const [weekDays, setWeekDays] = useState<string>('')
  const [courseLanguage, setCourseLanguage] = useState<string>('')
  const [lessonTime, setLessonTime] = useState<string>('')
  const [birthYear, setBirthYear] = useState<number | string>('')
  const [address, setAddress] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [activity, setActivity] = useState<string>('')

  // Handle input change for TextField components
  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = target
    switch (name) {
      case 'fullName':
        setFullName(value)
        break
      case 'phoneNumber1':
        setPhoneNumber1(value)
        break
      case 'phoneNumber2':
        setPhoneNumber2(value)
        break
      case 'weekDays':
        setWeekDays(value)
        break
      case 'courseLanguage':
        setCourseLanguage(value)
        break
      case 'lessonTime':
        setLessonTime(value)
        break
      case 'birthYear':
        setBirthYear(Number(value))
        break
      case 'address':
        setAddress(value)
        break
      case 'status':
        setStatus(value)
        break
      case 'activity':
        setActivity(value)
        break
    }
  }

  // Handle select change for Select components
  const handleSelectChange = (e: SelectChangeEvent<string>, field: string) => {
    const value = e.target.value as string
    switch (field) {
      case 'course':
        setCourse(value)
        break
      case 'weekDays':
        setWeekDays(value)
        break
      case 'courseLanguage':
        setCourseLanguage(value)
        break
      case 'status':
        setStatus(value)
        break
    }
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Accordion>
        <AccordionSummary id="form-layouts-header">
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            Reception
          </Typography>
        </AccordionSummary>
        <Divider sx={{ m: '0 !important' }} />
        <AccordionDetails>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Ism Familiya"
                placeholder="Ism Familiya"
                value={fullName}
                onChange={handleInputChange}
                name="fullName"
                inputProps={{ maxLength: 50 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon raqami"
                placeholder="+998-000-00-00"
                value={phoneNumber1}
                onChange={handleInputChange}
                name="phoneNumber1"
                inputProps={{ maxLength: 15 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefon raqami 2"
                placeholder="+998-000-00-00"
                value={phoneNumber2}
                onChange={handleInputChange}
                name="phoneNumber2"
                inputProps={{ maxLength: 50 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="course-label">Kurs</InputLabel>
                <Select
                  onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'course')}
                  labelId="course-label"
                >
                  <MenuItem value="1">Frontend</MenuItem>
                  <MenuItem value="2">Backend</MenuItem>
                  <MenuItem value="3">Mobile Development</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="weekDays-label">Hafta kunlari</InputLabel>
                <Select
                  value={weekDays}
                  onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'weekDays')}
                  labelId="weekDays-label"
                >
                  <MenuItem value="1">Dushanba-Chorshanba-Juma</MenuItem>
                  <MenuItem value="2">Seshanba-Payshanba-Shanba</MenuItem>
                  <MenuItem value="3">Har kuni</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="courseLanguage-label">Kurs tili</InputLabel>
                <Select
                  value={courseLanguage}
                  onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'courseLanguage')}
                  labelId="courseLanguage-label"
                >
                  <MenuItem value="uz">O'zbek</MenuItem>
                  <MenuItem value="ru">Rus</MenuItem>
                  <MenuItem value="en">Ingliz</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dars vaqti"
                placeholder="09:00 - 12:00"
                value={lessonTime}
                onChange={handleInputChange}
                name="lessonTime"
                inputProps={{ maxLength: 50 }}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tug'ilgan yili"
                placeholder="2000"
                type="number"
                value={birthYear}
                onChange={handleInputChange}
                name="birthYear"
                inputProps={{ min: 0, max: 2147483647 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Manzil"
                placeholder="Samarkand, Amir Temur ko'chasi"
                value={address}
                onChange={handleInputChange}
                name="address"
                inputProps={{ maxLength: 255 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  value={status}
                  onChange={(e: SelectChangeEvent<string>) => handleSelectChange(e, 'status')}
                  labelId="status-label"
                >
                  <MenuItem value="called">Telefonda gaplashildi</MenuItem>
                  <MenuItem value="not-called">Telefonda gaplashilmadi</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Faoliyat"
                placeholder="Qiziqishlari, maqsadlari, qo'shimcha ma'lumotlar"
                value={activity}
                onChange={handleInputChange}
                name="activity"
                inputProps={{ maxLength: 100 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Yuborish
              </Button>
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
    </form>
  )
}

export default FormLayoutsCollapsible

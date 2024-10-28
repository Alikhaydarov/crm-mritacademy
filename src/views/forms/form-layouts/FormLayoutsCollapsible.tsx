// ** React Imports
import { ChangeEvent, SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Grid from '@mui/material/Grid'
import Radio from '@mui/material/Radio'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Accordion from '@mui/material/Accordion'
import TextField from '@mui/material/TextField'
import FormLabel from '@mui/material/FormLabel'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import RadioGroup from '@mui/material/RadioGroup'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import FormControlLabel from '@mui/material/FormControlLabel'

// ** Third Party Imports
import Payment from 'payment'
import Cards, { Focused } from 'react-credit-cards'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Styled Component Imports
import CardWrapper from 'src/@core/styles/libs/react-credit-cards'

// ** Util Import
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from 'src/@core/utils/format'

// ** Styles Import
import 'react-credit-cards/es/styles-compiled.css'

// Styled component for the Box wrappers in Delivery Options' accordion
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  borderWidth: 1,
  display: 'flex',
  cursor: 'pointer',
  borderStyle: 'solid',
  padding: theme.spacing(5),
  borderColor: theme.palette.divider,
  '&:first-of-type': {
    borderTopLeftRadius: theme.shape.borderRadius,
    borderTopRightRadius: theme.shape.borderRadius
  },
  '&:last-of-type': {
    borderBottomLeftRadius: theme.shape.borderRadius,
    borderBottomRightRadius: theme.shape.borderRadius
  }
}))

const FormLayoutsCollapsible = () => {
  // ** States
  const [cvc, setCvc] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [focus, setFocus] = useState<string>('')
  const [expiry, setExpiry] = useState<string>('')
  const [cardNumber, setCardNumber] = useState<string>('')
  const [option, setOption] = useState<string>('standard')
  const [paymentMethod, setPaymentMethod] = useState<string>('card')
  const [expanded, setExpanded] = useState<string | false>('panel1')

  const handleChange = (panel: string) => (event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const handleBlur = () => setFocus('')

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    }
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<Icon icon='tabler:chevron-down' />}
          id='form-layouts-collapsible-header-1'
          aria-controls='form-layouts-collapsible-content-1'
        >
          <Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
           Reception
          </Typography>
        </AccordionSummary>
        <Divider sx={{ m: '0 !important' }} />
        <AccordionDetails>
          <Grid container spacing={5}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Ism Familiya' placeholder='Ism Familiya' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label='Telefon raqami' placeholder='+998-000-00-00' />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-collapsible-select-label'>O'qituvchisi</InputLabel>
                <Select
                  label='O`qituvchisi'
                  defaultValue=''
                  id='form-layouts-collapsible-select'
                  labelId='form-layouts-collapsible-select-label'
                >
                  <MenuItem value='UK'>Dilshod Ahmedov</MenuItem>
                  <MenuItem value='USA'>Shaxzod Samariddinov</MenuItem>
                  <MenuItem value='Sardor-Ramazonov'>Sardor Ramazonov</MenuItem>
                  <MenuItem value='Xayrullayev'>Xayruillayev Og'abek</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* <Grid item xs={12}>
              <TextField multiline rows={3} fullWidth label='Address' placeholder='1456, Liberty Street' />
            </Grid> */}
         <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-collapsible-select-label'>Hafta kunlari</InputLabel>
                <Select
                  label='Country'
                  defaultValue=''
                  id='form-layouts-collapsible-select'
                  labelId='form-layouts-collapsible-select-label'
                >
                  <MenuItem value='UK'>Dushanba-Chorshanba-Juma</MenuItem>
                  <MenuItem value='USA'>Seshanba-Payshanba-Shanba</MenuItem>
                  <MenuItem value='Australia'>Har-kuni</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-collapsible-select-label'>Kurs-tili</InputLabel>
                <Select
                  label='Country'
                  defaultValue=''
                  id='form-layouts-collapsible-select'
                  labelId='form-layouts-collapsible-select-label'
                >
                  <MenuItem value='UK'>O'zbek</MenuItem>
                  <MenuItem value='USA'>Rus-tili</MenuItem>
                  <MenuItem value='Australia'>Ingliz-tili</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel id='form-layouts-collapsible-select-label'>Status</InputLabel>
                <Select
                  label='Country'
                  defaultValue=''
                  id='form-layouts-collapsible-select'
                  labelId='form-layouts-collapsible-select-label'
                >
                  <MenuItem value='UK'>Telefonda gaplashildi</MenuItem>
                  <MenuItem value='USA'>telefonda gaplashilmadi</MenuItem>
                </Select>
              </FormControl>
            </Grid>

          </Grid>
          <br/>
          <Button variant='contained'   endIcon={<Icon icon='tabler:send' />}>
        Saqlash
      </Button>
        </AccordionDetails>
      </Accordion>
    </form>
  )
}

export default FormLayoutsCollapsible

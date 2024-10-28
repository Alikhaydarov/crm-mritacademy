import Grid from '@mui/material/Grid'

import TableBasicSort from 'src/views/table/data-grid/TableBasicSort'
// ** Styled Component
import { useState } from 'react'
// ** Demo Components Imports
import { Fab } from '@mui/material'
// button
import Icon from 'src/@core/components/icon'

//icon
import FormLayoutsCollapsible from 'src/views/forms/form-layouts/FormLayoutsCollapsible'

function index() {
  const [onMenu, setOnMenu] = useState<Boolean>(false)
  return (
    <div>
      <Grid container spacing={6}>
        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(8)} !important` }}></Grid>
        <Grid item xs={12} sx={{ pt: theme => `${theme.spacing(4)} !important` }}>
          <Fab
            onClick={() => setOnMenu(prevState => !prevState)}
            color='primary'
            variant='extended'
            sx={{ '& svg': { mr: 1 } }}
          >
            {onMenu ? <Icon icon='tabler:x' /> : <Icon icon='tabler:plus' />}
            {onMenu ? `yashirish` : `O'quvchi qo'shish`}
          </Fab>
          <br />
          <br />
          {onMenu ? <FormLayoutsCollapsible /> : ''}
        </Grid>
      </Grid>
      <br />
      <TableBasicSort />
    </div>
  )
}

export default index

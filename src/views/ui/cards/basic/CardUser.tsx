import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreVertIcon from '@mui/icons-material/MoreVert'

type CardUserProps = {
  fullname: string
  profession: string
  profile_image: string | null
  joined_date: string
  phone_number: string
}

const CardUser: React.FC<CardUserProps> = ({ fullname, profession, profile_image, joined_date, phone_number }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    console.log(`Edit action for: ${fullname}`)
    handleMenuClose()
  }

  const handleDelete = () => {
    console.log(`Delete action for: ${fullname}`)
    handleMenuClose()
  }

  return (
    <Card sx={{ position: 'relative', paddingTop: '5rem' }}>
      {/* Three-Dot Menu */}
      <IconButton
        sx={{ position: 'absolute', top: 8, right: 8 }}
        onClick={handleMenuClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </Menu>

      {/* Avatar */}
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '-4rem' }}>
        <Avatar
          alt={fullname}
          src={profile_image || '/images/avatars/default-avatar.png'} // Default avatar if thumbnail is null
          sx={{
            width: 200,
            height: 200,
            border: theme => `0.25rem solid ${theme.palette.common.white}`,
          }}
        />
      </Box>

      {/* Content */}
      <CardContent>
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
          }}
        >
          <Typography variant='h6'>{fullname}</Typography>
          <Typography variant='body1'>Kasbi: {profession}</Typography>
          <Typography variant='body1'>Joined: {new Date(joined_date).toLocaleDateString()}</Typography>
          <Typography variant='body1'>Phone: {phone_number}</Typography>
        </Box>
        <Button variant='contained' fullWidth>
          Send Request
        </Button>
      </CardContent>
    </Card>
  )
}

export default CardUser

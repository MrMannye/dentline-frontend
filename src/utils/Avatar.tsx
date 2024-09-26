import React from 'react'
import {Avatar as Profile } from '@mui/material'

function Avatar(props: {image: string}) {
  return (
    <Profile
        alt="Image Avatar"
        src={props.image}
        sx={{ width: 40, height: 40 }}
    />
  )
}

export default Avatar
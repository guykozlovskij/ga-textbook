import React from 'react'

export default function useForm(initialState) {
  const [formdata, setFormdata] = React.useState(initialState)
  const [errors, setErrors] = React.useState(initialState)

  const handleChange = event => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setFormdata({ ...formdata, [event.target.name]: value })
    setErrors({ ...errors, [event.target.name]: '' })
  }

  return {
    formdata,
    errors,
    handleChange,
    setErrors,
    setFormdata
  }
}

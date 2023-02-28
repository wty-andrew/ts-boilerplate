import React from 'react'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
}

const Button: React.FC<ButtonProps> = ({ label, ...props }) => (
  <button {...props}>{label}</button>
)

export default Button

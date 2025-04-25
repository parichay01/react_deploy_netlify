import React from 'react'
const today = new Date();
const Footer = ({ length }) => {
  return (
    <footer>
        <p> {length} List {length === 1 ? "Item" : "Items"}</p>
    </footer>
  )
}

export default Footer

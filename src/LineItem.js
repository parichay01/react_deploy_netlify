import { FaTrashAlt } from 'react-icons/fa';

import React from 'react'

const LineItem = ({ item, handleCheck, handleDelete }) => {    /*prop drilling from ItemList -> LineItem */
    return (
        <li className="Item">
            <input
                type="checkbox"
                onChange={() => handleCheck(item.id)}
                checked={item.checked}
            />
            <label
                style={(item.checked) ? { textDecoration: 'line-through' } : null}
                onDoubleClick={() => handleCheck(item.id)}
            > {item.item} </label>
            <FaTrashAlt
                onClick={() => handleDelete(item.id)}
                role="button"
                tabIndex="0"
                aria-label={`Delete ${item.item}`}
            />
        </li>
    )
}

export default LineItem
import ItemList from './ItemList';

const Content = ({ items, handleCheck, handleDelete }) => {  /*prop drilling from app -> content */

  return (
    <>
      {items.length ? (
        <ItemList
          items={items}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />
      ) : (
        <p style={{ marginTop: '2rem' }}>Your list is empty</p>
      )}
    </>
  )
}

export default Content

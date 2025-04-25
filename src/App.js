import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';

function App() {
  const STORAGE_KEY = 'groceryListItems';

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = () => {
      try {
        const storedItems = localStorage.getItem(STORAGE_KEY);
        const listItems = storedItems ? JSON.parse(storedItems) : [];
        setItems(listItems);
        setFetchError(null);
      }
      catch (err) {
        setFetchError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    };
    
    // Simulate loading delay (remove if not needed)
    setTimeout(() => {
      fetchItems();
    }, 200);
  }, []);

  const saveItemsToStorage = (itemsToSave) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(itemsToSave));
    } catch (err) {
      setFetchError(err.message);
    }
  };

  const addItem = (item) => {
    const maxId = items.reduce((max, item) => {
      const currentId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;
      return Math.max(max, currentId);
    }, 0);
    
    const id = (maxId + 1).toString();
    const myNewItem = { id, checked: false, item };
    const listItems = [...items, myNewItem];
    
    setItems(listItems);
    saveItemsToStorage(listItems);
  };
  
  const handleCheck = (id) => {
    const listItems = items.map((item) => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    setItems(listItems);
    saveItemsToStorage(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
    saveItemsToStorage(listItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  };

  return (
    <div className="App">
      <Header title="Grocery List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem
        search={search}
        setSearch={setSearch}
      />
      <main>
        {isLoading && <p>Loading Items...</p>}
        {fetchError && <p style={{ color: 'red' }}>{`Error:${fetchError}`}</p>}
        {!fetchError && !isLoading && <Content 
          items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}
          handleCheck={handleCheck}
          handleDelete={handleDelete}
        />}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;

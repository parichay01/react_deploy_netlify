import Header from './Header';
import SearchItem from './SearchItem';
import AddItem from './AddItem';
import Content from './Content';
import Footer from './Footer';
import { useState, useEffect } from 'react';
import apiRequest from './apiRequest';

function App() {
  const API_URL = 'http://localhost:3500/items';

  const [items, setItems] = useState([]);             //setting the initial state to fetch from the localstorage so the list can be updated everytime rather than fetching the default state everytime. and the null array to work with when the list is initially empty

  const [newItem, setNewItem] = useState('');
  const [search, setSearch] = useState('');
  const [fetchError, setFetchError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {

    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw Error('Did not receive expected data');
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      }
      catch (err) {
        setFetchError(err.message);
      }
      finally {
        setIsLoading(false);
      }
    }
    setTimeout(() => {
      fetchItems();
    }, 2000)
  }, [])     //triggers on the dependency '[]' means trigger only at loadtime

  /*=========Function for adding new items=========*/

  const addItem = async (item) => {
    // Convert all IDs to numbers first to find max, then make new ID a string
    const maxId = items.reduce((max, item) => {
      const currentId = typeof item.id === 'string' ? parseInt(item.id, 10) : item.id;          //converting the string id to numeric to calculate the current max id
      return Math.max(max, currentId);   
    }, 0);
    
    const id = (maxId + 1).toString(); // Convert new ID to string
  
    const myNewItem = { id, checked: false, item }; // id will be string
    const listItems = [...items, myNewItem];
    setItems(listItems);
  
    const postOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(myNewItem)
    };
    
    const result = await apiRequest(API_URL, postOptions);
    if (result) setFetchError(result);
  }
  
/*=========Function for checking the items=========*/

  const handleCheck = async (id) => {
    const listItems = items.map((item) => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(listItems);

    const myItem = listItems.filter((item) => item.id === id);
    const updateOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ checked: myItem[0].checked })    //myItem[0] => refers to the filtered array with one matched id item 
    };
      const reqUrl = `${API_URL}/${id}`;
      const result = await apiRequest(reqUrl, updateOptions);
      if(result) setFetchError(result);
  }

  /*=========Function for deleting the items=========*/

  const handleDelete = async (id) => {
    const listItems = items.filter((item) => item.id !== id)
    setItems(listItems);

    const deleteOptions = { method: 'DELETE'};
    const reqUrl = `${API_URL}/${id}`;
    const result = await apiRequest(reqUrl, deleteOptions);
      if(result) setFetchError(result);
  }

  const handleSubmit = (e) => {
    e.preventDefault();       //preventing the page from reload
    if (!newItem) return;
    addItem(newItem);
    setNewItem('');
  }

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

        {!fetchError && !isLoading && <Content items={items.filter(item => ((item.item).toLowerCase()).includes(search.toLowerCase()))}    //the content will only show if there's no fetchError and loading is completed
          handleCheck={handleCheck}                       //prop drilling
          handleDelete={handleDelete}
        />}

      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;

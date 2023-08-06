import { useState } from 'react';
import './App.css';
import { NewUserForm } from './components/newUserForm';
import { UserList } from './components/userList';
import { UserProvider } from './context/UserContext';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <UserProvider>
      <div className="App container">
        <NewUserForm selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        <UserList selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
      </div>
    </UserProvider>
  );
}

export default App;
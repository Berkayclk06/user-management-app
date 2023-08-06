import React, { useContext, useEffect, useState } from 'react';
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell, CTableFoot } from '@coreui/react';
import { collection, query, getDocs, orderBy, limit, startAfter, startAt, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import UserContext from '../context/UserContext';
import '../App.css';


interface UserListProps {
  selectedUser: any;
  setSelectedUser: (user: any) => void;
}

export const UserList: React.FC<UserListProps> = ({ selectedUser, setSelectedUser }) => {
    const [userList, setUserList] = useState<any>([]);
    const userCollectionRef = collection(db, "Users");
    const { userUpdated, setUserUpdated } = useContext<any>(UserContext);
    const [lastDoc, setLastDoc] = useState<any>(null);
    const [firstDoc, setFirstDoc] = useState<any>(null);
    const [page, setPage] = useState<any>(0);
      
    const getUserList = async (direction = 'next', doc = null) => {
      try {
        let data;

        switch (direction) {
          case 'next':
            if (doc) {
              data = await getDocs(query(collection(db, 'Users'), orderBy('name'), startAfter(doc), limit(10)));
            } else {
              data = await getDocs(query(collection(db, 'Users'), orderBy('name'), limit(10)));
            }
            break;
          case 'previous':
            if (doc) {
              data = await getDocs(query(collection(db, 'Users'), orderBy('name'), startAt(doc), limit(10)));
            }
            break;
          default:
            console.log(`Unknown direction: ${direction}`);
            return;
        }

        const users = data?.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

        setUserList(users);
        setFirstDoc(data?.docs[0] || null);
        setLastDoc(data?.docs[data.docs.length - 1] || null);
      } catch (err) {
        console.error(err);
      }
    };

  
    useEffect(() => {
      getUserList();
    }, []);
    
    const handleNext = () => {
      getUserList('next', lastDoc);
      setPage(page + 1);
    };
    
    const handlePrevious = () => {
      getUserList('previous', firstDoc);
      setPage(page - 1);
    };

    const deleteUser = async (id: any) => {
      try {
        const userDoc = doc(db, "Users", id)
        await deleteDoc(userDoc)
        getUserList();
        if (selectedUser?.id === id) {
          setSelectedUser(null);
        }
      } catch (err) {
        console.error(err);
      }
    }
  
  
    return (
<div className="table-container UserList">
{userList.length > 0 ? (
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Country</CTableHeaderCell>
              <CTableHeaderCell>City</CTableHeaderCell>
              <CTableHeaderCell>Date of Birth</CTableHeaderCell>
              <CTableHeaderCell>Delete User</CTableHeaderCell>
              <CTableHeaderCell>Select for Update</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
          {userList.map((user: any) => {
            return (
              <CTableRow key={user.id}>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>{user.country.label}</CTableDataCell>
                <CTableDataCell>{user.city.label}</CTableDataCell>
                {/* Display the date string */}
                <CTableDataCell>{new Date(user.dateOfBirth.seconds * 1000).toISOString().split('T')[0]}</CTableDataCell>
                <CTableDataCell><button className="delete-button" onClick={() => deleteUser(user.id)}> Delete User</button></CTableDataCell>
                <CTableDataCell>
                  <input
                    type="checkbox"
                    checked={selectedUser?.id === user.id}
                    onChange={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                  />
                </CTableDataCell>
              </CTableRow>
            );
          })}
          </CTableBody>
        </CTable>
      ) : (
        <div className="no-data">
          There's no data
        </div>
      )}
      </div>
    );
  }
  
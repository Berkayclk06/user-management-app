import React, { useContext, useEffect, useState } from 'react';
import { CTable, CTableBody, CTableHead, CTableHeaderCell, CTableRow, CTableDataCell } from '@coreui/react';
import { collection, query, getDocs, orderBy, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import UserContext from '../context/UserContext';
import '../App.css';
import * as Types from './types';




export const UserList: React.FC<Types.UserListProps> = ({ selectedUser, setSelectedUser }) => {
    const [userList, setUserList] = useState<any>([]);
    const userCollectionRef = collection(db, "Users");
    const { userUpdated } = useContext<any>(UserContext);
      
    const getUserList = async () => {
      try {
        const data = await getDocs(query(userCollectionRef, orderBy("createdAt")));
        const filteredData: any = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setUserList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      getUserList();
    }, [userUpdated]);
  

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
  
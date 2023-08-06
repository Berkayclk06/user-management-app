import React, { useContext, useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { collection, addDoc, Timestamp, updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import Select from 'react-select';
import { CForm, CFormLabel, CFormInput, CButton, CRow, CCol } from '@coreui/react';
import UserContext from '../context/UserContext';
import '../App.css';


interface SelectOption {
  value: string;
  label: string;
}

interface FormInputs {
  username: string;
  dob: string;
  country?: SelectOption;
  city?: SelectOption;
}

interface NewUserFormProps {
    selectedUser: any;
    setSelectedUser: (user: any) => void;
}

const countryOptions: SelectOption[] = [
  { value: 'Canada', label: 'Canada' },
  { value: 'USA', label: 'USA' },
];

const cityOptionsMap: Record<string, SelectOption[]> = {
  Canada: [
    { value: 'Ottawa', label: 'Ottawa' },
    { value: 'Toronto', label: 'Toronto' },
  ],
  USA: [
    { value: 'Las Vegas', label: 'Las Vegas' },
    { value: 'Chicago', label: 'Chicago' },
  ],
};

function dateStringToTimestamp(dateString: string) {
    // Parse the date as UTC
    const date = new Date(dateString + 'T00:00:00Z');
    const seconds = Math.floor(date.getTime() / 1000);
    return new Timestamp(seconds, 0);
}

function localDateStringToAdjustedDate(localDateString:any) {
  // Parse the date string
  const [year, month, day] = localDateString.split('-').map(Number);

  // Create a Date object with the local date adjusted to UTC
  const date = new Date(Date.UTC(year, month - 1, day));

  return date;
}
  

  

export const NewUserForm: React.FC<NewUserFormProps> = ({ selectedUser, setSelectedUser }) => {
  const { handleSubmit, control, setValue, reset } = useForm<FormInputs>();
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(null);
  const userCollectionRef = collection(db, "Users");
  const { userUpdated, setUserUpdated } = useContext(UserContext);
  const [selectKey, setSelectKey] = useState(0);


  useEffect(() => {
    if (selectedUser) {
      setValue('username', selectedUser.name);
      setValue('dob', new Date(selectedUser.dateOfBirth.seconds * 1000).toISOString().split('T')[0]);
      setValue('country', selectedUser.country);
      setValue('city', selectedUser.city);
      setSelectedCountry(selectedUser.country);
    } else {
      reset();
      setSelectedCountry(null);
    }
  }, [selectedUser, setValue, reset]);
  
  
  const onSubmit = async (data: FormInputs) => {
    try{
      console.log("Submitted");
      
      if (selectedUser) {
        const userDoc = doc(db, "Users", selectedUser.id)
        await updateDoc(userDoc, { 
          name: data.username, 
          dateOfBirth: dateStringToTimestamp(data.dob), 
          country: data.country, 
          city: data.city,
          userId: auth?.currentUser?.uid
        });
        setSelectedUser(null);
      } else {
        const date = localDateStringToAdjustedDate(data.dob);
        await addDoc(userCollectionRef, {
          name: data.username, 
          dateOfBirth: Timestamp.fromDate(date), // Convert the adjusted date to a Timestamp
          country: data.country, 
          city: data.city,
          userId: auth?.currentUser?.uid
        });
      }
  
      setUserUpdated((currentState: boolean) => !currentState);
      reset();
      setSelectedCountry(null);
      setSelectKey(prevKey => prevKey + 1); // increment the key
  
    } catch (err) {
      console.error(err);
    }
  }
  
  
  

  const handleCountryChange = (selectedOption: SelectOption | null) => {
    setSelectedCountry(selectedOption);
  };

  const cityOptions = selectedCountry ? cityOptionsMap[selectedCountry.value] : [];

  return (
    <div className="form-container NewUseForm">
      <CForm className="CForm" onSubmit={handleSubmit(onSubmit)}>
        <CRow>
          <CCol>
            <CFormLabel className="CFormLabel" htmlFor="username">Name</CFormLabel>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              render={({ field }) => <CFormInput className="CFormInput" {...field} type="text" id="username" placeholder="Name..." />}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CFormLabel className="CFormLabel" htmlFor="dob">Date of birth</CFormLabel>
            <Controller
              name="dob"
              control={control}
              defaultValue=""
              render={({ field }) => <CFormInput className="CFormInput" {...field} type="date" id="dob" placeholder="Date of birth" />}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CFormLabel className="CFormLabel" htmlFor="country">Country</CFormLabel>
            <Controller
              name="country"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                  <Select
                  className="Select"
                  {...field}
                  options={countryOptions}
                  key={selectKey}
                  onChange={value => {
                      handleCountryChange(value);
                      field.onChange(value);
                  }}
                  />
              )}
              />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CFormLabel className="CFormLabel" htmlFor="city">City</CFormLabel>
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                  <Select
                  className="Select"
                  {...field}
                  options={cityOptions}
                  isDisabled={!selectedCountry}
                  key={selectKey}
                  />
              )}
              />
          </CCol>
        </CRow>
        <CRow>
          <CCol>
            <CButton className="form-button" type="submit" color="primary">Add</CButton>
          </CCol>
        </CRow>
      </CForm>
    </div>
  );
  }
  
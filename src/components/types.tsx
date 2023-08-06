export interface SelectOption {
    value: string;
    label: string;
  }
  
  export interface FormInputs {
    username: string;
    dob: string;
    country?: SelectOption;
    city?: SelectOption;
  }
  
  export interface UserListProps {
    selectedUser: any;
    setSelectedUser: (user: any) => void;
  }
  
  export interface NewUserFormProps {
    selectedUser: any;
    setSelectedUser: (user: any) => void;
}
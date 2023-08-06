export interface User {
    name: string;
    dateOfBirth: Date;
    country: { value: string, label: string };
    city: { value: string, label: string };
}

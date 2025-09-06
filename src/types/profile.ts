export interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string | null;
  fullName?: string;
  phoneNumber?: string;
}

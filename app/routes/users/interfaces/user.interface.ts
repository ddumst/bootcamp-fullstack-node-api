export interface ApgUser {
  bannerImage: string;
  birthday: Date;
  countryId: number;
  createdAt: Date;
  email: string;
  id: number;
  isActive: boolean;
  isBetaUser: boolean;
  isVerified: boolean;
  isWorker: boolean;
  lastname: string;
  name: string;
  online: boolean;
  profileImage: string;
  showBirthday: boolean;
  username: string;
  updatedAt: Date;
}

export interface ApgFile {
  caption?: string;
  createdAt?: Date;
  height: number;
  id?: number;
  isActive: boolean;
  name: string;
  type: string;
  updatedAt?: Date;
  url: string;
  width: number;
}
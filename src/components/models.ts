export interface Todo {
  id: number;
  content: string;
}

export interface Meta {
  totalCount: number;
}

export interface UserData {
  id:string;
  color:string;
  initials:string;
  name:string;
  lastName:string;
  email:string;
  role:string;
}

export interface Book {
  id: string;
  title:string;
  slug: string;
  coverImage:string;
  year:number;
  stock:number;
  author:string;
  categoryId:{
    _id?:string;
    category?:string;
    slug?:string;
  };
  userId:{
    _id?:string;
    name?:string;
    lastName?:string;
  };
}

export interface Category {
  id: string;
  category:string;
  slug:string;
  books:number;
  isActive:boolean;
}

export interface User {
  id: string;
  name: string;
  lastName: string;
  email: string;
  initials: string;
  color: string;
  loans: number;
  hasAccess: boolean;
  role: string;
}

import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlineShoppingCart,
  MdOutlinePerson3,
} from 'react-icons/md';

// Admin Imports
import MainDashboard from 'views/admin/default';
import Sales from 'views/admin/sales';
import Branches from 'views/admin/branches';
import Profile from 'views/admin/profile';
import Customers from 'views/admin/customers';
import GetUsers from 'views/admin/users/all-users';
import AddUser from 'views/admin/users/add-user';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/signUp';
import Users from "views/admin/users";
import CreateUser from "views/admin/users/create";

const routes = [
  {
    name: 'Main Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component: MainDashboard,
  },
  {
    name: 'sales',
    layout: '/admin',
    path: '/sales',
    icon: (
      <Icon
        as={MdOutlineShoppingCart}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    component: Sales,
    secondary: true,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/branches',
    component: Branches,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Profile,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/customers',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: Customers,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: Users,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/user/create',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: CreateUser,
  },
  {
    name: 'Sign In',
    layout: '/auth',
    path: '/sign-in',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignInCentered,
  },
  {
    name: 'Sign Up',
    layout: '/auth',
    path: '/sign-up',
    icon: <Icon as={MdLock} width="20px" height="20px" color="inherit" />,
    component: SignUpCentered,
  },
];

export default routes;

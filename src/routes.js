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
import CreateBranch from 'views/admin/branches/CreateBranch';
import ViewAllStaff from 'views/admin/branches/ViewAllStaff';
import EditBranch from 'views/admin/branches/EditBranch';
import ViewBranch from 'views/admin/branches/ViewBranch';
import ViewStaff from 'views/admin/branches/ViewBranchStaff';
import Profile from 'views/admin/profile';
import Customers from 'views/admin/customers';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/signUp';
import Users from 'views/admin/users';
import CreateUser from 'views/admin/users/create';
import User from 'views/admin/users/get-user';
import EditUser from 'views/admin/users/edit';
import CreateCustomer from 'views/admin/customers/create';
import ViewCustomer from 'views/admin/customers/view-customer';
import Deposit from 'views/admin/account/deposit';
import Withdraw from 'views/admin/account/withdrawal';
import { FaBox, FaMoneyBill } from 'react-icons/fa';
// import { RiFileShield2Fill } from "react-icons/ri";
import DailySavingsDashboard from "views/admin/daily-savings";
import MakeContribution from "views/admin/daily-savings/deposit";
import CreatePackage from "views/admin/daily-savings/package";
import Withdrawal from "views/admin/daily-savings/withdrawal";

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
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/branch/create',
    component: CreateBranch,
  },
  {
    name: 'View All Staff',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/branch/viewallstaff',
    component: ViewAllStaff,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/branch/editbranch/:id',
    component: EditBranch,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/branch/viewbranch/:id',
    component: ViewBranch,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    path: '/branch/viewstaff/:id',
    component: ViewStaff,
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
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    component: Customers,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/customer/create',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: CreateCustomer,
  },

  {
    name: 'Customer',
    layout: '/admin',
    path: '/customer/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: ViewCustomer,
  },
  {
    name: 'Account',
    layout: '/admin',
    path: '/transaction/withdraw',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    component: Withdraw,
  },
  {
    name: 'Account',
    layout: '/admin',
    path: '/transaction/deposit',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    component: Deposit,
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
    path: '/user/edit-user/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: EditUser,
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
    name: 'Users',
    layout: '/admin',
    path: '/user/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    component: User,
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
  {
    name: 'Deposit',
    layout: '/admin',
    path: '/daily-savings/deposit',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    component: MakeContribution,
  },
  {
    name: 'Withdraw',
    layout: '/admin',
    path: '/daily-savings/withdraw',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    component: Withdrawal,
  },
  {
    name: 'Customer',
    layout: '/admin',
    path: '/daily-savings',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    component: DailySavingsDashboard,
  },
  {
    name: 'Packages',
    layout: '/admin',
    path: '/daily-saving/package',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    component: CreatePackage,
  },
];

export default routes;

import React from 'react';

import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdPerson,
  MdHome,
  MdLock,
  MdOutlinePerson3,
} from 'react-icons/md';
import {
  FaProductHunt,
  FaSitemap,
  FaUsers,
  FaShoppingBag,
  FaShoppingCart,
  FaSms,
} from 'react-icons/fa';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';

// Admin Imports
import MainDashboard from 'views/admin/default';
// import Sales from 'views/admin/sales';
import Branches from 'views/admin/branches';
import CreateBranch from 'views/admin/branches/CreateBranch';
import ViewAllStaff from 'views/admin/branches/ViewAllStaff';
import EditBranch from 'views/admin/branches/EditBranch';
import ViewBranch from 'views/admin/branches/ViewBranch';
import ViewStaff from 'views/admin/branches/ViewBranchStaff';
import Profile from 'views/admin/profile';
import Customers from 'views/admin/customers';
import BranchCustomers from 'views/admin/branches/ViewBranchCustomers';
import AssignManager from 'views/admin/customers/assign-manager';

// Auth Imports
import SignInCentered from 'views/auth/signIn';
import SignUpCentered from 'views/auth/signUp';
import Users from 'views/admin/users';
import CreateUser from 'views/admin/users/create';
import User from 'views/admin/users/get-user';
import EditUser from 'views/admin/users/edit';
import CreateCustomer from 'views/admin/customers/create';
import CustomerByStaff from 'views/admin/customers/customerByStaff';
import ViewCustomerDs from 'views/admin/daily-savings/ds-package';
import ViewCustomerSb from 'views/admin/daily-savings/sb-package';
import EditCustomer from 'views/admin/customers/edit-customer';
import Deposit from 'views/admin/account/deposit';
import Withdraw from 'views/admin/account/withdraw';
import BankTransfer from 'views/admin/account/bank-transfer';
import WithdrawalRequest from 'views/admin/account/withdrawal-request';
import { FaBox, FaMoneyBill } from 'react-icons/fa';
import MakeContribution from 'views/admin/daily-savings/deposit';
import CreatePackage from 'views/admin/daily-savings/package';
import Transfer from 'views/admin/daily-savings/withdrawal';
import CreateAccount from 'views/admin/customers/create-account';
import Accounting from 'views/admin/accounting';
import Expenditures from 'views/admin/accounting/expenditure';
import ExpenditureDetail from 'views/admin/accounting/expenditure-detail';

import Products from 'views/admin/products';
import ProductsRequest from 'views/admin/products/product-requests';
import SelectedProducts from 'views/admin/products/selected-products';
import CreateCatalogue from 'views/admin/products/create-catalogue';
import CatalogueDetails from 'views/admin/products/single-product-catalogue';
import EditProductCatalogue from 'views/admin/products/catalogue/edit';

import Collections from 'views/admin/stores/collections';
import Categories from 'views/admin/stores/category';
import Brands from 'views/admin/stores/brands';
import StaffDetailsPage from 'views/admin/branches/StaffDetails';

import Stores from 'views/admin/stores';
import ResetPassword from 'views/admin/profile/ResetPassword';

import PlaceOrder from 'views/admin/orders/placeorder';
import Orders from 'views/admin/orders';
import SingleOder from 'views/admin/orders/single-order';
import Transactions from 'views/admin/account/transanctions';
import { IoIosAnalytics } from 'react-icons/io';
import BranchDashboard from 'views/admin/branches/BranchDashboard';
import BulkSms from 'views/admin/sms/bulk';
import Note from 'views/admin/accounting/note-keeping';
import LandingPage from 'views/landing';
import PrivacyPolicy from 'views/privacy';
import TermsOfService from 'views/terms';

const routes = [
  {
    name: 'Dashboard',
    layout: '/admin',
    path: '/default',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: MainDashboard,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={FaSitemap} width="20px" height="20px" color="inherit" />,
    path: '/branches',
    roles: ['superAdmin'],
    component: Branches,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin'],
    path: '/branch/create',
    component: CreateBranch,
  },
  {
    name: 'View All Staff',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager'],
    path: '/branch/viewallstaff',
    component: ViewAllStaff,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin'],
    path: '/branch/editbranch/:id',
    component: EditBranch,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    path: '/branch/viewbranch/:id',
    component: ViewBranch,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager'],
    path: '/branch/viewstaff/:id',
    component: ViewStaff,
  },
  {
    name: 'Branches',
    layout: '/admin',
    icon: <Icon as={MdBarChart} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager'],
    path: '/branch/dashboard/:id',
    component: BranchDashboard,
  },
  {
    name: 'Branches',
    layout: '/admin',
    path: '/branch/staff/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: StaffDetailsPage,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile/reset-password',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    roles: [],
    component: ResetPassword,
  },
  {
    name: 'Profile',
    layout: '/admin',
    path: '/profile',
    icon: <Icon as={MdPerson} width="20px" height="20px" color="inherit" />,
    roles: [],
    component: Profile,
  },

  // customer routes
  {
    name: 'Customers',
    layout: '/admin',
    path: '/customers',
    icon: (
      <Icon
        as={AiOutlineUsergroupAdd}
        width="20px"
        height="20px"
        color="inherit"
      />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Customers,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/customer/create',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CreateCustomer,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/customer/staffaccounts/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CustomerByStaff,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/branch/viewbranchcustomers/:branchId',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: BranchCustomers,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/customer/create-account',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CreateAccount,
  },
  {
    name: 'Customers',
    layout: '/admin',
    path: '/account/assign-manager',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: AssignManager,
  },

  {
    name: 'Customer',
    layout: '/admin',
    path: '/customer/edit-customer/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: EditCustomer,
  },

  {
    name: 'Customer',
    layout: '/admin',
    path: '/customer/ds/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: ViewCustomerDs,
  },

  {
    name: 'Customer',
    layout: '/admin',
    path: '/customer/sb/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: ViewCustomerSb,
  },

  // account routes

  {
    name: 'Transactions',
    layout: '/admin',
    path: '/transactions',
    icon: (
      <Icon as={IoIosAnalytics} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Transactions,
  },

  {
    name: 'Account',
    layout: '/admin',
    path: '/transaction/withdraw/:requestId',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: WithdrawalRequest,
  },
  {
    name: 'Account',
    layout: '/admin',
    path: '/transaction/bank-transfer',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: BankTransfer,
  },
  {
    name: 'Account',
    layout: '/admin',
    path: '/transaction/withdraw',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Withdraw,
  },
  {
    name: 'Account',
    layout: '/admin',
    path: '/transaction/deposit',
    icon: <Icon as={FaUsers} width="20px" height="20px" color="inherit" />,
    component: Deposit,
  },

  // user
  {
    name: 'Users',
    layout: '/admin',
    path: '/users',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin'],
    component: Users,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/user/edit-user/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: EditUser,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/user/create',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CreateUser,
  },
  {
    name: 'Users',
    layout: '/admin',
    path: '/user/:id',
    icon: (
      <Icon as={MdOutlinePerson3} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: User,
  },

  // user auth
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

  // daily savings
  {
    name: 'Deposit',
    layout: '/admin',
    path: '/daily-savings/deposit/:packageId',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: MakeContribution,
  },
  {
    name: 'Withdraw',
    layout: '/admin',
    path: '/daily-savings/withdraw/:packageId',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Transfer,
  },
  {
    name: 'Packages',
    layout: '/admin',
    path: '/daily-saving/package',
    icon: <Icon as={FaBox} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CreatePackage,
  },

  // Accounting route
  {
    name: 'Accounting',
    layout: '/admin',
    path: '/accounting/dashboard',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Accounting,
  },
  {
    name: 'Expenditure',
    layout: '/admin',
    path: '/accounting/expenditure/:id',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: ExpenditureDetail,
  },
  {
    name: 'Expenditure',
    layout: '/admin',
    path: '/accounting/expenditure',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Expenditures,
  },

  {
    name: 'Note',
    layout: '/admin',
    path: '/accounting/note/:id',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager'],
    component: Note,
  },
  {
    name: 'Note',
    layout: '/admin',
    path: '/accounting/note',
    icon: <Icon as={FaMoneyBill} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin', 'admin', 'manager'],
    component: Note,
  },

  {
    name: 'Catalogue',
    layout: '/admin',
    path: '/products/catalogue-details/:id',
    icon: (
      <Icon as={FaProductHunt} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CatalogueDetails,
  },
  {
    name: 'Catalogue',
    layout: '/admin',
    path: '/products/catalogue/edit/:id',
    icon: (
      <Icon as={FaProductHunt} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: EditProductCatalogue,
  },
  {
    name: 'Catalogue',
    layout: '/admin',
    path: '/products/catalogue/create',
    icon: (
      <Icon as={FaProductHunt} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: CreateCatalogue,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products/requests',
    icon: (
      <Icon as={FaProductHunt} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: ProductsRequest,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products/sb-products',
    icon: (
      <Icon as={FaProductHunt} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager'],
    component: SelectedProducts,
  },
  {
    name: 'Products',
    layout: '/admin',
    path: '/products',
    icon: (
      <Icon as={FaProductHunt} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Products,
  },
  {
    name: 'Stores',
    layout: '/admin',
    path: '/store',
    icon: (
      <Icon as={FaShoppingBag} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin'],
    component: Stores,
  },
  {
    name: 'Collections',
    layout: '/admin',
    path: '/stores/collections',
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Collections,
  },
  {
    name: 'Categories',
    layout: '/admin',
    path: '/stores/categories',
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Categories,
  },
  {
    name: 'Brands',
    layout: '/admin',
    path: '/stores/brands',
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Brands,
  },

  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders/placeorder',
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: PlaceOrder,
  },

  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders/:id',
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: SingleOder,
  },

  {
    name: 'Orders',
    layout: '/admin',
    path: '/orders',
    icon: (
      <Icon as={FaShoppingCart} width="20px" height="20px" color="inherit" />
    ),
    roles: ['superAdmin', 'admin', 'manager', 'userReps'],
    component: Orders,
  },

  {
    name: 'SMS',
    layout: '/admin',
    path: '/sms',
    icon: <Icon as={FaSms} width="20px" height="20px" color="inherit" />,
    roles: ['superAdmin'],
    component: BulkSms,
  },

  {
    name: 'Home',
    layout: '/home',
    path: '/',
    component: LandingPage,
  },

  {
    name: 'Privacy',
    layout: '/home',
    path: '/privacy',
    component: PrivacyPolicy,
  },

  {
    name: 'Terms',
    layout: '/home',
    path: '/terms',
    component: TermsOfService,
  },
];

export default routes;

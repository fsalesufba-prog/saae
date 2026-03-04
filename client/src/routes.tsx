import React from 'react';
import { RouteObject } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import UsersList from './pages/admin/users/List';
import UsersCreate from './pages/admin/users/Create';
import UsersEdit from './pages/admin/users/Edit';
import NewsList from './pages/admin/news/List';
import NewsCreate from './pages/admin/news/Create';
import NewsEdit from './pages/admin/news/Edit';
import CarouselList from './pages/admin/carousel/List';
import CarouselCreate from './pages/admin/carousel/Create';
import CarouselEdit from './pages/admin/carousel/Edit';
import GalleryList from './pages/admin/galleries/List';
import GalleryCreate from './pages/admin/galleries/Create';
import GalleryEdit from './pages/admin/galleries/Edit';
import GalleryMedia from './pages/admin/galleries/Media';
import BidsList from './pages/admin/bids/List';
import BidsCreate from './pages/admin/bids/Create';
import BidsEdit from './pages/admin/bids/Edit';
import NotFound from './pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: '',
        element: <Dashboard />
      },
      {
        path: 'users',
        element: <UsersList />
      },
      {
        path: 'users/create',
        element: <UsersCreate />
      },
      {
        path: 'users/edit/:id',
        element: <UsersEdit />
      },
      {
        path: 'news',
        element: <NewsList />
      },
      {
        path: 'news/create',
        element: <NewsCreate />
      },
      {
        path: 'news/edit/:id',
        element: <NewsEdit />
      },
      {
        path: 'carousel',
        element: <CarouselList />
      },
      {
        path: 'carousel/create',
        element: <CarouselCreate />
      },
      {
        path: 'carousel/edit/:id',
        element: <CarouselEdit />
      },
      {
        path: 'galleries',
        element: <GalleryList />
      },
      {
        path: 'galleries/create',
        element: <GalleryCreate />
      },
      {
        path: 'galleries/edit/:id',
        element: <GalleryEdit />
      },
      {
        path: 'galleries/media/:id',
        element: <GalleryMedia />
      },
      {
        path: 'bids',
        element: <BidsList />
      },
      {
        path: 'bids/create',
        element: <BidsCreate />
      },
      {
        path: 'bids/edit/:id',
        element: <BidsEdit />
      }
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
];

export default routes;
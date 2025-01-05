import { lazy, Suspense } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';

// ----------------------------------------------------------------------

export const Login = lazy(() => import('src/pages/login'));
export const HomePage = lazy(() => import('src/pages/home'));

export const UserPage = lazy(() => import('src/pages/user/user'));
export const CreateUser = lazy(() => import('src/pages/user/createUser'));
export const EditUser = lazy(() => import('src/pages/user/editUser'));
export const ShowUser = lazy(() => import('src/pages/user/showUser'));

export const OutletPage = lazy(() => import('src/pages/outlets/outlets'));
export const CreateOutlet = lazy(() => import('src/pages/outlets/createOutlets'));
export const EditOutlet = lazy(() => import('src/pages/outlets/editOutlets'));
export const ShowOutlet = lazy(() => import('src/pages/outlets/showOutlets'));

export const MembersPage = lazy(() => import('src/pages/members/members'));
export const CreateMembers = lazy(() => import('src/pages/members/createMembers'));
export const EditMembers = lazy(() => import('src/pages/members/editMembers'));
export const ShowMembers = lazy(() => import('src/pages/members/showMembers'));

export const PaketsPage = lazy(() => import('src/pages/pakets/paket'));
export const CreatePakets = lazy(() => import('src/pages/pakets/createPakets'));
export const EditPakets = lazy(() => import('src/pages/pakets/editPakets'));
export const ShowPakets = lazy(() => import('src/pages/pakets/showPakets'));

export const TrxPage = lazy(() => import('src/pages/transactions/transactions'));
export const CreateTrx = lazy(() => import('src/pages/transactions/createTransaction'));
export const EditTrx = lazy(() => import('src/pages/transactions/editTransaction'));
export const ShowTrx = lazy(() => import('src/pages/transactions/showTransaction'));

export const BlogPage = lazy(() => import('src/pages/blog'));

export const SignInPage = lazy(() => import('src/pages/sign-in'));
export const ProductsPage = lazy(() => import('src/pages/products'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));

// ----------------------------------------------------------------------

const renderFallback = (
  <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export function Router() {
  return useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense fallback={renderFallback}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: 'dashboard', element: <HomePage /> },

        { path: 'outlets', element: <OutletPage /> },
        { path: 'outlets/create-outlet', element: <CreateOutlet /> },
        { path: 'outlets/edit-outlet/:id', element: <EditOutlet /> },
        { path: 'outlets/show-outlet/:id', element: <ShowOutlet /> },

        { path: 'members', element: <MembersPage /> },
        { path: 'members/create-member', element: <CreateMembers /> },
        { path: 'members/edit-member/:id', element: <EditMembers /> },
        { path: 'members/show-member/:id', element: <ShowMembers /> },

        { path: 'user', element: <UserPage /> },
        { path: 'user/create-user', element: <CreateUser /> },
        { path: 'user/edit-user/:id', element: <EditUser /> },
        { path: 'user/show-user/:id', element: <ShowUser /> },

        { path: 'pakets', element: <PaketsPage /> },
        { path: 'pakets/create-paket', element: <CreatePakets /> },
        { path: 'pakets/edit-paket/:id', element: <EditPakets /> },
        { path: 'pakets/show-paket/:id', element: <ShowPakets /> },

        { path: 'trx', element: <TrxPage /> },
        { path: 'trx/create-trx', element: <CreateTrx /> },
        { path: 'trx/edit-trx/:id', element: <EditTrx /> },
        { path: 'trx/show-trx/:id', element: <ShowTrx /> },

        { path: 'products', element: <ProductsPage /> },
        { path: 'blog', element: <BlogPage /> },
      ],
    },
    {
      path: 'sign-in',
      element: (
        <AuthLayout>
          <SignInPage />
        </AuthLayout>
      ),
    },
    {
      path: '404',
      element: <Page404 />,
    },
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);
}

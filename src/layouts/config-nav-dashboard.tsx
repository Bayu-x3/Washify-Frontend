import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: icon('ic-analytics'),
  },
  {
  title: 'Outlets',
    path: '/outlets',
    icon: icon('ic-shop'),
  },
  {
    title: 'Members',
    path: '/members',
    icon: icon('ic-user'),
  },
  {
    title: 'Users',
    path: '/user',
    icon: icon('ic-users'),
  },
  {
    title: 'Pakets',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Transactions',
    path: '/blog',
    icon: icon('ic-money'),
  },
  {
    title: 'Details Transactions',
    path: '/404',
    icon: icon('ic-notebook'),
  },
];

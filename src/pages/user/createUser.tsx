import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserCreate } from 'src/sections/user/view/create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`User Create - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserCreate />
    </>
  );
}

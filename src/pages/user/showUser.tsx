import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserShow } from 'src/sections/user/view/show';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`User Show - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserShow />
    </>
  );
}

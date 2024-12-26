import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserEdit } from 'src/sections/user/view/edit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`User Edit - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserEdit />
    </>
  );
}

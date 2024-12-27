import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MemberEdit } from 'src/sections/members/view/edit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Member Edit - ${CONFIG.appName}`}</title>
      </Helmet>

      <MemberEdit />
    </>
  );
}

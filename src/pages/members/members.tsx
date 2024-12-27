import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MemberView } from 'src/sections/members/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Members - ${CONFIG.appName}`}</title>
      </Helmet>

      <MemberView />
    </>
  );
}

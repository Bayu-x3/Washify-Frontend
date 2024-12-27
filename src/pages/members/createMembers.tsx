import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MemberCreate } from 'src/sections/members/view/create';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Members Create - ${CONFIG.appName}`}</title>
      </Helmet>

      <MemberCreate />
    </>
  );
}

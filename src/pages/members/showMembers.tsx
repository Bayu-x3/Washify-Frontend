import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MemberShow } from 'src/sections/members/view/show';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Member Show - ${CONFIG.appName}`}</title>
      </Helmet>

      <MemberShow />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MeShowEdit } from 'src/sections/me/showEdit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Member Show - ${CONFIG.appName}`}</title>
      </Helmet>

      <MeShowEdit />
    </>
  );
}

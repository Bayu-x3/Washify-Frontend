import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailsEdit } from 'src/sections/details/view/edit';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Details Edit - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailsEdit />
    </>
  );
}

import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { DetailsShow } from 'src/sections/details/view/show';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Member Show - ${CONFIG.appName}`}</title>
      </Helmet>

      <DetailsShow />
    </>
  );
}

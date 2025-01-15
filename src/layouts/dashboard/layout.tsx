// eslint-disable-next-line perfectionist/sort-imports
import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
// eslint-disable-next-line perfectionist/sort-imports
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';

import { useRouter } from 'src/routes/hooks';

import { Iconify } from 'src/components/iconify';

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { Searchbar } from '../components/searchbar';
import apiEndpoint from '../../contants/apiEndpoint';
import { _workspaces } from '../config-nav-workspace';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { AccountPopover } from '../components/account-popover';
import { navData as allNavData } from '../config-nav-dashboard';

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const [navOpen, setNavOpen] = useState(false);
  const layoutQuery: Breakpoint = 'lg';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isListening, setIsListening] = useState(false);
  const [filteredNavData, setFilteredNavData] = useState(allNavData);

  // Fetch user role from the API
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          console.warn('No access token found');
          router.push('/');
          return;
        }

        const response = await fetch(`${apiEndpoint.me}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();

        if (result.success && result.data.role) {
          const { role } = result.data;

          const filteredData =
            role === 'kasir'
              ? allNavData.filter((item) => ['Members', 'Transactions'].includes(item.title))
              : role === 'owner'
                ? allNavData.filter((item) => ['Dashboard'].includes(item.title))
                : allNavData;

          setFilteredNavData(filteredData);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, [router]);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      console.error('Browser does not support Web Speech API');
    } else {
      const recognition = new window.webkitSpeechRecognition(); // eslint-disable-line new-cap
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: any) => {
        let transcript = event.results[0][0].transcript.trim().toLowerCase();
        transcript = transcript.replace(/[.,!?]/g, '');
        console.log('Recognized:', transcript);

        const commandMap: Record<string, string> = {
          'open page user': '/user',
          'open create user': '/user/create-user',
          'go to dashboard': '/dashboard',
          'open page outlets': '/outlets',
          'open create outlets': '/outlets/create-outlet',
          'open page members': '/members',
          'open create members': '/members/create-member',
          'open page pakets': '/pakets',
          'open create pakets': '/pakets/create-paket',
        };

        const targetUrl = commandMap[transcript];
        if (targetUrl) {
          window.location.href = targetUrl;
        } else {
          console.warn('Command not recognized:', transcript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.onend = () => {
        console.log('Voice recognition stopped.');
      };

      recognition.start();
    }
  };

  return (
    <LayoutSection
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 5 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={filteredNavData}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                  workspaces={_workspaces}
                />
              </>
            ),
            rightArea: (
              <Box gap={1} display="flex" alignItems="center">
                <Searchbar />
                <IconButton
                  color={isListening ? 'primary' : 'default'}
                  onClick={startListening}
                  title="Start voice command"
                >
                  <Iconify width={24} icon="solar:microphone-bold-duotone" />
                </IconButton>
                <AccountPopover
                  data={[
                    {
                      label: 'Settings',
                      href: '/me',
                      icon: <Iconify width={22} icon="solar:settings-bold-duotone" />,
                    },
                  ]}
                />
              </Box>
            ),
          }}
        />
      }
      sidebarSection={
        <NavDesktop data={filteredNavData} layoutQuery={layoutQuery} workspaces={_workspaces} />
      }
      footerSection={null}
      cssVars={{
        '--layout-nav-vertical-width': '300px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(8),
        '--layout-dashboard-content-px': theme.spacing(5),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}

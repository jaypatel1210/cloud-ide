import { useMemo } from 'react';
import {
  Typography,
  Stack,
  MenuList,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import {
  Account,
  AccountPreview,
  AccountPopoverFooter,
  SignOutButton,
  AccountPreviewProps,
} from '@toolpad/core/Account';

import { useAuth } from '../../context/AuthProvider';

const AccountSidebarPreview = (
  props: AccountPreviewProps & { mini: boolean }
) => {
  const { handleClick, open, mini } = props;
  return (
    <Stack direction="column" p={0} overflow="hidden">
      <Divider />
      <AccountPreview
        variant={mini ? 'condensed' : 'expanded'}
        handleClick={handleClick}
        open={open}
      />
    </Stack>
  );
};

const DashboardFooterPopover = () => {
  const { user } = useAuth();

  return (
    <Stack direction="column">
      <Typography variant="body2" mx={2} mt={1}>
        Account
      </Typography>
      <MenuList>
        <MenuItem
          key={user.uid}
          component="button"
          sx={{
            justifyContent: 'flex-start',
            width: '100%',
            columnGap: 2,
          }}
        >
          <ListItemIcon>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.95rem',
              }}
              src={user.photoURL ?? ''}
              alt={user.displayName ?? ''}
            >
              {user.displayName?.charAt(0) ?? ''}
            </Avatar>
          </ListItemIcon>
          <ListItemText
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
            primary={user.displayName}
            secondary={user.email}
            primaryTypographyProps={{ variant: 'body2' }}
            secondaryTypographyProps={{ variant: 'caption' }}
          />
        </MenuItem>
      </MenuList>
      <Divider />
      <AccountPopoverFooter>
        <SignOutButton />
      </AccountPopoverFooter>
    </Stack>
  );
};

const createPreviewComponent = (mini: boolean) => {
  function PreviewComponent(props: AccountPreviewProps) {
    return <AccountSidebarPreview {...props} mini={mini} />;
  }
  return PreviewComponent;
};

const DashboardFooter = ({ mini }: SidebarFooterProps) => {
  const PreviewComponent = useMemo(() => createPreviewComponent(mini), [mini]);

  return (
    <Account
      slots={{
        preview: PreviewComponent,
        popoverContent: DashboardFooterPopover,
      }}
      slotProps={{
        popover: {
          transformOrigin: { horizontal: 'left', vertical: 'bottom' },
          anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
          disableAutoFocus: true,
          slotProps: {
            paper: {
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: theme =>
                  `drop-shadow(0px 2px 8px ${
                    theme.palette.mode === 'dark'
                      ? 'rgba(255,255,255,0.10)'
                      : 'rgba(0,0,0,0.32)'
                  })`,
                mt: 1,
                '&::before': {
                  content: '""',
                  display: 'block',
                  position: 'absolute',
                  bottom: 10,
                  left: 0,
                  width: 10,
                  height: 10,
                  bgcolor: 'background.paper',
                  transform: 'translate(-50%, -50%) rotate(45deg)',
                  zIndex: 0,
                },
              },
            },
          },
        },
      }}
    />
  );
};

export default DashboardFooter;

import {
  Box,
  BoxProps,
  Typography,
  TypographyProps,
  styled,
  Grid,
  GridProps,
} from '@mui/material';

export const HeaderSection = styled(Box)<BoxProps>(() => ({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-around',
  color: 'white',
  zIndex: 999,
  position: 'relative',
}));

export const HeaderTitle = styled(Typography)<TypographyProps>(({ theme }) => ({
  lineHeight: 1.2,
  textAlign: 'center',
  fontSize: 50,
  // fontFamily: "Parisienne",
  [theme.breakpoints.down('md')]: {
    fontSize: 20,
  },
}));

export const LogoHeader = styled('div')<TypographyProps>(({ theme }) => ({
  paddingLeft: 33,
  fontSize: 36,
  color: '#FF6063',
  cursor: 'pointer',
  [theme.breakpoints.down('md')]: {
    fontSize: 12,
  },
}));

export const SelectLanguage = styled('select')(() => ({
  background: 'transparent',
  border: 0,
  color: 'white',
  fontFamily: 'Heebo',
  fontWeight: 500,
  ':hover': {
    color: '#FF6063',
  },
  '& option': {
    color: 'black',
  },
}));

export const LanguageSiteBox = styled(Grid)<GridProps>(({ theme }) => ({
  textAlign: 'center',
  alignItems: 'center',
  display: 'flex',
  [theme.breakpoints.down('sm')]: {
    fontSize: 12,
  },
}));

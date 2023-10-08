import { Grid, GridProps, styled } from '@mui/material';

export const FeaturedAds = styled('div')(() => ({
  fontFamily: 'Parisienne',
  fontStyle: 'normal',
  fontWeight: 800,
  fontSize: '48px',
  color: 'green',
}));

export const GridCard = styled(Grid)<GridProps>(({ theme }) => ({
  paddingBottom: '85px',
  [theme.breakpoints.down('md')]: {
    margin: 'auto',
    textAlign: 'center',
    justifyContent: 'center',
    display: 'flex',
  },
}));

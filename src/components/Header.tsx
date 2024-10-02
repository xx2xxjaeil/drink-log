import React from 'react';
import { AppBar, Container, IconButton, SvgIcon, Toolbar, Typography } from '@mui/material';

/**
 * Header component
 *
 * @author 이재일<dlwodlf000@gmail.com>
 */
const Header = () => {
  // 뒤로가기
  const pageBackFunc = React.useCallback(() => {
    console.debug(`테마 상세화면에서 기기의 '뒤로가기' 버튼이 감지되었습니다.`);
    if (window.history.length > 0) {
      // navigate(-1);
    } else {
      // navigate('/', { replace: true });
    }
  }, []);

  return (
    <AppBar position="sticky" color="transparent">
      <Container maxWidth="xs" sx={{ p: [0, 0] }}>
        <Toolbar>
          <IconButton edge="start">
            <ArrowBackIcon />
          </IconButton>
          <Typography
            noWrap
            fontSize="18px"
            fontWeight={800}
            color="text.primary"
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)'
            }}
          >
            toolbar
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;

const ArrowBackIcon = React.memo(() => {
  return (
    <SvgIcon viewBox="0 0 22 34">
      <path style={{ fill: 'none' }} d="M0 0h22v34H0z" />
      <path
        d="m2702.722 91.173-6 6 6 6"
        transform="translate(-2693.722 -80.173)"
        style={{ stroke: 'currentcolor', strokeWidth: '2px', fill: 'none' }}
      />
      <path transform="translate(4 16)" style={{ fill: 'currentcolor' }} d="M0 0h18v2H0z" />
    </SvgIcon>
  );
});

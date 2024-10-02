import React from 'react';
import { IconButton, SvgIcon } from '@mui/material';
import type { SxProps, Theme } from '@mui/system';

interface PageBackProps {
  width?: number;
  height?: number;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

/**
 * Page back button
 *
 * @author 이재일<dlwodlf000@gmail.com>
 */
const PageBack: React.FC<PageBackProps> = ({ width = 34, height = 34, sx = { ml: '-16px' }, onClick }) => {
  return (
    <IconButton onClick={onClick} edge="start" sx={sx}>
      <SvgIcon viewBox="0 0 22 34" style={{ width, height }}>
        <path style={{ fill: 'none' }} d="M0 0h22v34H0z" />
        <path
          d="m2702.722 91.173-6 6 6 6"
          transform="translate(-2693.722 -80.173)"
          style={{ stroke: 'currentcolor', strokeWidth: '2px', fill: 'none' }}
        />
        <path transform="translate(4 16)" style={{ fill: 'currentcolor' }} d="M0 0h18v2H0z" />
      </SvgIcon>
    </IconButton>
  );
};

export default PageBack;

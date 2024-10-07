'use client';
import React from 'react';
import Image from 'next/image';
import * as Yup from 'yup';
import logo2 from '@/public/images/logo2.png';

// material-ui
import { Box, FormControl, IconButton, InputAdornment, InputLabel, Input, TextField, Typography } from '@mui/material';
import { HighlightOff, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { useFormik } from 'formik';
import axios from 'axios';

// 로그인 폼 타입
interface LoginFormValuesType {
  email: string;
  password: string;
}

/**
 * 로그인 화면
 */
const Login: React.FC = () => {
  // 비밀번호 보이기 상태
  const [showPassword, setShowPassword] = React.useState<boolean>(false);

  // 로그인 필드 유효성 검사
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('이메일 형식이 아닙니다.').required('이메일을 입력해주세요.'),
    password: Yup.string().trim().min(4, '비밀번호는 4자 이상이어야 합니다.').required('비밀번호를 입력해주세요.')
  });

  // 로그인 폼
  const loginForm = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      console.log('### values: ', values);

      // 잘못된 로그인 정보
      const { email, password } = values;
      if (!email || !password) return;

      // 로그인 요청
      handleLogin(values);
    }
  });

  // 로그인 요청
  const handleLogin = async (values: LoginFormValuesType) => {
    console.log('#### values: ', values);

    const { email, password } = values;

    try {
      const res = await axios.post('/api/auth/login', { email, password });

      const { data } = res;
      console.log('### data: ', data);
    } catch (error) {
      console.error('login error: ', error);
    }
  };

  return (
    <Box p={2}>
      <Box mt={20} mb={6} textAlign="center">
        <Image src={logo2} alt="dd" />
      </Box>

      <Box>
        <form onSubmit={loginForm.handleSubmit}>
          <Box display="grid" gap={1.5}>
            {/* 이메일 */}
            <FormControl fullWidth variant="standard">
              <TextField
                label="이메일"
                name="email"
                variant="standard"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={loginForm.touched.email && Boolean(loginForm.errors.email)}
                helperText={loginForm.touched.email && loginForm.errors.email}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {loginForm.values.email && (
                          <IconButton onClick={() => loginForm.setFieldValue('email', '')} edge="end">
                            <HighlightOff />
                          </IconButton>
                        )}
                      </InputAdornment>
                    )
                  }
                }}
              />
            </FormControl>

            {/* 비밀번호 */}
            <FormControl fullWidth variant="standard">
              <TextField
                label="비밀번호"
                name="password"
                variant="standard"
                type={showPassword ? 'text' : 'password'}
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
                error={loginForm.touched.password && Boolean(loginForm.errors.password)}
                helperText={loginForm.touched.password && loginForm.errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </FormControl>
          </Box>

          <Box mt={6}>
            <LoadingButton
              fullWidth
              // loading={loginLoading}
              color="inherit"
              size="large"
              variant="outlined"
              type="submit"
              disabled={!loginForm.isValid || !loginForm.values.email || !loginForm.values.password}
            >
              로그인
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Login;

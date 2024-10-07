'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

// material-ui
import { Box, FormControl, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import { HighlightOff, Visibility, VisibilityOff } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

// components
import PageBack from '@/components/PageBack';

// 회원가입 폼 타입
interface SignupFormValuesType {
  email: string;
  password: string;
  nickname: string;
}
/**
 * 회원가입 페이지
 *
 * @author 이재일<dlwodlf000@gmail.com>
 */
const Signup: React.FC = () => {
  const router = useRouter();

  // 비밀번호 보이기 상태
  const [showPassword, setShowPassword] = React.useState<boolean>(false);
  // 회원가입 진행 중 로딩 상태
  const [signUpLoading, setSignUpLoading] = React.useState<boolean>(false);
  // 회원가입 API 오류
  const [signUpError, setSignUpError] = React.useState<{ error: boolean; msg: string }>({
    error: false,
    msg: ''
  });
  // 비밀번호 보이기/숨기기
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  // 뒤로가기 클릭 이벤트
  const handlePageBack = () => router.back();

  // 회원가입 필드 유효성 검사
  const validationSchema = Yup.object().shape({
    email: Yup.string().email('이메일 형식이 아닙니다.').required('이메일을 입력해주세요.'),
    password: Yup.string().trim().min(4, '비밀번호는 4자 이상이어야 합니다.').required('비밀번호를 입력해주세요.'),
    nickname: Yup.string().trim().min(2, '2글자 이상 입력해주세요.').max(8, '8글자 이하로 입력해주세요').required('닉네임을 입력해주세요.')
  });

  // 회원가입 폼
  const signupForm = useFormik<SignupFormValuesType>({
    initialValues: {
      email: '',
      password: '',
      nickname: ''
    },
    validationSchema,
    validateOnMount: true,
    onSubmit: (values) => {
      // 회원 가입 정보가 올바르지 않음
      const { email, password, nickname } = values;
      if (!email || !password || !nickname) return;
      handleSignup(values);
    }
  });

  // 회원가입 요청
  const handleSignup = async (values: SignupFormValuesType) => {
    setSignUpLoading(true);
    setSignUpError({ error: false, msg: '' });
    console.log('values: ', values);
    const { email, password, nickname } = values;

    try {
      const res = await axios.post('/api/auth', { email, password, nickname });
      console.log('### res: ', res);

      const { data } = res;
      // 회원가입 실패
      if (!data.success) {
        setSignUpError({ error: true, msg: data.message });
        return;
      }

      // 회원가입 성공
      router.push('/login');
    } catch (error) {
      console.error('sign up error: ', error);
      setSignUpError({ error: true, msg: '잠시 후 다시 시도해주세요.' });
    } finally {
      setSignUpLoading(false);
    }
  };

  return (
    <Box>
      <PageBack onClick={handlePageBack} />

      <Typography typography="h5" fontWeight="bold">
        회원가입
      </Typography>
      <Box p={1} mt={2}>
        <form onSubmit={signupForm.handleSubmit}>
          <Box display="grid" gap={1.5}>
            {/* 이메일 */}
            <FormControl fullWidth variant="standard">
              <TextField
                label="이메일*"
                name="email"
                variant="standard"
                value={signupForm.values.email}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={signupForm.touched.email && Boolean(signupForm.errors.email)}
                helperText={signupForm.touched.email && signupForm.errors.email}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {signupForm.values.email && (
                          <IconButton onClick={() => signupForm.setFieldValue('email', '')} edge="end">
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
                label="비밀번호*"
                name="password"
                variant="standard"
                type={showPassword ? 'text' : 'password'}
                value={signupForm.values.password}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={signupForm.touched.password && Boolean(signupForm.errors.password)}
                helperText={signupForm.touched.password && signupForm.errors.password}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={handleClickShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />
            </FormControl>

            {/* 닉네임 */}
            <FormControl fullWidth variant="standard">
              <TextField
                label="닉네임*"
                name="nickname"
                variant="standard"
                value={signupForm.values.nickname}
                onChange={signupForm.handleChange}
                onBlur={signupForm.handleBlur}
                error={signupForm.touched.nickname && Boolean(signupForm.errors.nickname)}
                helperText={signupForm.touched.nickname && signupForm.errors.nickname}
              />
            </FormControl>
          </Box>

          {/* 회원가입 중 오류 발생 */}
          {signUpError.error && (
            <Box m={2} textAlign="center">
              <Typography color="error">{signUpError.msg}</Typography>
            </Box>
          )}

          <Box mt={6}>
            <LoadingButton
              fullWidth
              loading={signUpLoading}
              color="inherit"
              size="large"
              variant="outlined"
              type="submit"
              disabled={!signupForm.isValid || signUpLoading}
            >
              회원가입
            </LoadingButton>
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default Signup;

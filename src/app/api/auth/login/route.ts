import { NextRequest, NextResponse } from 'next/server';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
/**
 * 로그인 API
 */

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: '이메일과 비밀번호를 입력해주세요.' }, { status: 400 });
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // 로그인 실패 시 에러 메시지 반환
    if (!userCredential || !userCredential.user) {
      return NextResponse.json({ success: false, message: '아이디 또는 비밀번호가 잘못되었습니다.' }, { status: 401 });
    }

    const user = userCredential.user;
    console.log('#### user: ', user);

    // 로그인 성공 시 토큰 또는 세션 설정 로직 추가 가능
    // return NextResponse.json({ success: true, uid: user.uid, email: user.email });
  } catch (error) {
    // console.error('로그인 중 에러 발생: ', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 401 });
  }
}

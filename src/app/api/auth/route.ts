import { NextRequest, NextResponse } from 'next/server';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from '@firebase/firestore';
import admin from 'firebase-admin'; // 여기가 중요합니다.
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

/**
 * email 회원가입 API
 */
export async function POST(req: NextRequest) {
  const body = await req.json();

  const { email, password, nickname } = body;

  // email, password, nickname 유효성 검사
  if (!email) return NextResponse.json({ error: '이메일을 입력해주세요.' }, { status: 400 });
  if (!password || password.trim().length < 4) return NextResponse.json({ error: '비밀번호를 입력해주세요.' }, { status: 400 });
  if (!nickname || nickname.trim().length < 2) return NextResponse.json({ error: '닉네임을 입력해주세요.' }, { status: 400 });

  // email 중복 체크
  try {
    const memberRef = adminDb.collection('member').where('email', '==', email);
    const memberSnapshot = await memberRef.get();

    console.log('memberSnapshot: ', memberSnapshot);

    // 해당 email로 가입된 계정이 있음
    if (!memberSnapshot.empty) {
      console.error('이미 가입된 이메일입니다.');
      return NextResponse.json({ success: false, message: '이미 가입된 이메일입니다.' }, { status: 200 });
    }
  } catch (error) {
    console.error('회원가입 중 email 중복 체크 에러: ', error);
    return NextResponse.json({ error: '회원가입 중 에러가 발생했습니다.' }, { status: 500 });
  }

  // nickname 중복 체크
  try {
    const memberRef = adminDb.collection('member').where('nickname', '==', nickname);
    const memberSnapshot = await memberRef.get();

    // 해당 nickname으로 가입된 계정이 있음
    if (!memberSnapshot.empty) {
      console.error('이미 사용중인 닉네임입니다.');
      return NextResponse.json({ success: false, message: '이미 사용중인 닉네임입니다.' }, { status: 200 });
    }
  } catch (error) {
    console.error('회원가입 중 nickname 중복 체크 에러: ', error);
    return NextResponse.json({ error: '회원가입 중 에러가 발생했습니다.' }, { status: 500 });
  }

  // 회원가입 진행
  try {
    // 1. Firebase Authentication 사용자 추가
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: nickname
    });

    // 2. Firestore 사용자 정보 추가
    await adminDb.collection('member').doc(userRecord.uid).set({
      uid: userRecord.uid,
      email: userRecord.email,
      nickname: userRecord.displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 3. 성공 응답
    return NextResponse.json({ success: true, message: '회원가입 성공!', userId: userRecord.uid });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

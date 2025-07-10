import Signin from "../../components/signin-component";
import Head from 'next/head';

export default function SigninPage() {
  return (
    <>
      <Head>
        <title>เข้าสู่ระบบ - 3D Modern UI</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Signin />
    </>
  );
}
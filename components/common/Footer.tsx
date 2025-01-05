'use client';

import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/auth';

const Footer = () => {
  const router = useRouter();
  
  const goFeedBack = () => {
    if (!getToken()) {
      router.push('/login');
    } else {
      router.push('/feedback');
    }
  };

  return (
    <div className="footer">
      <div className="box_center cf">
        <div className="copyright text-center">
              Copyright (C) xxyopen.com All rights
              reserved&nbsp;&nbsp; 1novel
        </div>
      </div>
    </div>
  );
};

export default Footer;
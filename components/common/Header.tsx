import React from 'react';
import Navbar from '@/components/common/Navbar';
import Top from '@/components/common/Top';

interface HeaderProps {} // 如果组件有接收外部传入的props，可以在这里定义类型

const Header: React.FC<HeaderProps> = () => {
    return (
        <div className="header">
            <Top />
            <Navbar />
        </div>
    );
};

export default Header;
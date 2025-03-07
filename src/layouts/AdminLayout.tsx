import { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
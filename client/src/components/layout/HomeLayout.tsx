import { Outlet } from 'react-router-dom';
import { PublicNavbar } from './PublicNavbar';
import { PublicFooter } from './PublicFooter';

const HomeLayout = () => {
  return (
    <div className="min-h-screen bg-[#e6f5ef] text-[#0f3d2e]">
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
};

export default HomeLayout;

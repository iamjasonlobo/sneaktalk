import { Outlet, Link } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <div className="nav">
        <div className="logo"><img className="nav-logo" src="https://i.imgur.com/ppBfeyH.png" height={"70px"} alt="sneaktalk logo"/></div>
        
        <div className="menu-section">
        <Link className='nav-link' to="/">Home</Link>
        <Link className='nav-link' to="/create">Post</Link></div>
       </div>
      <div className="whole-page">
        <Outlet />
      </div>
      </div>
  );
};

export default Layout;
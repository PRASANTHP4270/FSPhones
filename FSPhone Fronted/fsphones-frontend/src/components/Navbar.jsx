
import { Link, NavLink } from "react-router-dom"
import {
  Smartphone,
  House,
  Grid2X2,
  ShieldCheck,
  ArrowUpRight
} from "lucide-react"

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="fs-mark">
          <span>F</span>
          <Smartphone size={23} strokeWidth={2.2} />
        </span>

        <span className="brand-name">
          FS<span>PHONES</span>
          <small>TECH • STYLE • TRUST</small>
        </span>
      </Link>

      <div className="nav-links">
        <NavLink to="/" end>
          <House size={17} />
          <span>Home</span>
        </NavLink>

        <NavLink to="/" end>
          <Grid2X2 size={17} />
          <span>Explore Phones</span>
        </NavLink>

        <NavLink to="/admin-login" className="admin-nav-link">
          <ShieldCheck size={17} />
          <span>Admin</span>
          <ArrowUpRight size={14} />
        </NavLink>
      </div>
    </nav>
  )
}

export default Navbar

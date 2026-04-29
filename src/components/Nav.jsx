import { NavLink } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="nav">
      <div className="nav__inner">
        <span className="nav__name">Remembering Phil</span>
        <ul className="nav__links">
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/memories" className={({ isActive }) => isActive ? 'active' : ''}>
              Memories
            </NavLink>
          </li>
          <li>
            <NavLink to="/gallery" className={({ isActive }) => isActive ? 'active' : ''}>
              Gallery
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  )
}

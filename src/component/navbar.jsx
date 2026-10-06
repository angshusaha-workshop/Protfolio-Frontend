function Navbar() {
  return (
    <nav className="navbar" aria-label="Main navigation">
      <a href="#top" className="logo">
        Angshu<span>.</span>
      </a>

      <div className="nav-links">
        <a href="#work">Work</a>
        <a href="#about">About</a>
        <a href="#contact">Contact</a>
      </div>

      <a href="#contact" className="nav-button">
        Let&apos;s talk ↗
      </a>
    </nav>
  )
}

export default Navbar

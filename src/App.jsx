import { useEffect, useState } from 'react'
import './App.css'

import Navbar from './component/navbar'
import heroImage from './assets/angshu-portrait.jpeg'

const getProjectGithubUrl = (project) => {
  if (
    project.githubUrl &&
    project.githubUrl !== 'https://github.com/'
  ) {
    return project.githubUrl
  }

  return `https://github.com/search?q=${encodeURIComponent(project.title)}&type=repositories`
}

function App() {
  // =========================================
  // API URL
  // =========================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    'http://localhost:5000/api'


  // =========================================
  // Projects State
  // =========================================

  const [projects, setProjects] = useState([])

  const [projectLoading, setProjectLoading] =
    useState(true)


  // =========================================
  // Contact Form State
  // =========================================

  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const [status, setStatus] = useState({
    type: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] =
    useState(false)


  // =========================================
  // GET PROJECTS FROM MONGODB
  // =========================================

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(
          `${API_URL}/projects`
        )

        if (!response.ok) {
          throw new Error(
            'Failed to load projects'
          )
        }

        const data = await response.json()

        setProjects(data)

      } catch (error) {
        console.error(
          'Failed to fetch projects:',
          error
        )

      } finally {
        setProjectLoading(false)
      }
    }

    fetchProjects()
  }, [])

  // =========================================
  // PAGE LOAD MOTION
  // =========================================

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion) {
      document.documentElement.classList.add('page-ready')
      return
    }

    const timer = window.setTimeout(() => {
      document.documentElement.classList.add('page-ready')
    }, 80)

    return () => window.clearTimeout(timer)
  }, [])


  useEffect(() => {
    const revealItems = document.querySelectorAll('[data-reveal]')
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach((item) => {
        item.classList.add('is-visible')
      })
      return
    }

    document.documentElement.classList.add('scroll-reveal-ready')

    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            currentObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -48px 0px',
      }
    )

    revealItems.forEach((item) => observer.observe(item))

    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('scroll-reveal-ready')
    }
  }, [projects.length])

  useEffect(() => {
    const cards = document.querySelectorAll('.project')
    const finePointer = window.matchMedia(
      '(hover: hover) and (pointer: fine)'
    ).matches

    if (!finePointer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const removeListeners = []

    cards.forEach((card) => {
      const handlePointerMove = (event) => {
        const bounds = card.getBoundingClientRect()
        const x = (event.clientX - bounds.left) / bounds.width - 0.5
        const y = (event.clientY - bounds.top) / bounds.height - 0.5

        card.style.setProperty('--tilt-x', `${-y * 6}deg`)
        card.style.setProperty('--tilt-y', `${x * 6}deg`)
      }

      const resetTilt = () => {
        card.style.setProperty('--tilt-x', '0deg')
        card.style.setProperty('--tilt-y', '0deg')
      }

      card.addEventListener('pointermove', handlePointerMove)
      card.addEventListener('pointerleave', resetTilt)
      removeListeners.push(() => {
        card.removeEventListener('pointermove', handlePointerMove)
        card.removeEventListener('pointerleave', resetTilt)
      })
    })

    return () => removeListeners.forEach((removeListener) => removeListener())
  }, [projects.length])


  // =========================================
  // CONTACT FORM INPUT
  // =========================================

  const updateField = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    })
  }


  // =========================================
  // CONTACT FORM SUBMIT
  // =========================================

  const submitContact = async (event) => {
    event.preventDefault()

    setIsSubmitting(true)

    setStatus({
      type: '',
      message: '',
    })

    try {
      const response = await fetch(
        `${API_URL}/contact`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(form),
        }
      )

      const data =
        await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
          'Unable to send your message.'
        )
      }

      setForm({
        name: '',
        email: '',
        message: '',
      })

      setStatus({
        type: 'success',
        message:
          data.message ||
          'Message sent successfully!',
      })

    } catch (error) {
      setStatus({
        type: 'error',
        message:
          error.message,
      })

    } finally {
      setIsSubmitting(false)
    }
  }


  // =========================================
  // PAGE
  // =========================================

  return (
    <main className="portfolio-page">

      {/* =====================================
          NAVBAR
      ===================================== */}

      <Navbar />


      {/* =====================================
          HERO SECTION
      ===================================== */}

      <section
        className="hero container"
        id="top"
      >

        <div className="hero-top" data-reveal="fade-up">

          <p className="eyebrow">
            <span aria-hidden="true">✦</span>
            Available for new opportunities
          </p>

          <p className="hero-number">
            CSE Student / Full-Stack Developer
          </p>

        </div>


        <div className="hero-content">

          <div className="hero-layout">

            {/* Hero Text */}

            <div className="hero-text" data-reveal="fade-up">

              <h1>
                I design &amp;
                <br />
                build digital
                <br />
                experiences.
              </h1>


              <div className="hero-bottom">

                <p className="hero-copy">
                  I&apos;m Angshu Saha, a
                  Computer Science student
                  focused on web development
                  and creative digital products.
                </p>

                <div className="hero-actions">
                  <a
                    className="primary-button"
                    href="#work"
                  >
                    View my work
                    <span>↗</span>
                  </a>

                  <a
                    className="secondary-button"
                    href="#contact"
                  >
                    Let&apos;s talk
                    <span aria-hidden="true">↗</span>
                  </a>
                </div>

              </div>

            </div>


            {/* Hero Image */}

            <div className="hero-visual" data-reveal="scale">
              <img
                src={heroImage}
                alt="Angshu Saha at a desk"
                className="hero-image"
              />

              <p className="hero-name-overlay" aria-hidden="true">
                Angshu Saha
              </p>

            </div>
          </div>

        </div>

      </section>


      {/* =====================================
          PROJECTS SECTION
      ===================================== */}

      <section
        className="work-section container"
        id="work"
      >

        <div className="section-heading" data-reveal="fade-up">

          <p className="eyebrow">
            Selected work
          </p>

          <h2>
            A few things I&apos;ve made.
          </h2>

        </div>


        {/* =================================
            LOADING
        ================================= */}

        {projectLoading && (

          <div className="projects-loading">

            <p>
              Loading projects...
            </p>

          </div>

        )}


        {/* =================================
            NO PROJECTS
        ================================= */}

        {!projectLoading &&
          projects.length === 0 && (

            <div className="projects-loading">

              <p>
                No projects available yet.
              </p>

            </div>

          )}


        {/* =================================
            PROJECTS FROM MONGODB
        ================================= */}

        {!projectLoading &&
          projects.length > 0 && (

            <div className="projects">

              {projects.map(
                (project, index) => (

                  <article
                    className={
                      `project ${
                        index % 3 === 0
                          ? 'project-coral'
                          : index % 3 === 1
                          ? 'project-dark'
                          : 'project-yellow'
                      }`
                    }
                    key={project._id}
                    data-reveal="fade-up"
                    style={{ '--reveal-delay': `${(index % 4) * 90}ms` }}
                  >

                    {/* Project Image */}

                    {project.image && (

                      <img
                        src={project.image}
                        alt={project.title}
                        className="project-image"
                      />

                    )}


                    {/* Project Number */}

                    <span>
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}{' '}
                      / Project
                    </span>


                    {/* Project Title */}

                    <h3>
                      {project.title}
                    </h3>


                    {/* Project Description */}

                    {project.description && (

                      <p className="project-description">
                        {project.description}
                      </p>

                    )}


                    {/* Technologies */}

                    {project.technologies?.length > 0 && (

                      <div className="project-technologies">

                        {project.technologies.map(
                          (
                            technology,
                            technologyIndex
                          ) => (

                            <span
                              key={
                                technologyIndex
                              }
                            >
                              {technology}
                            </span>

                          )
                        )}

                      </div>

                    )}


                    {/* Project Links */}

                    <div className="project-links">

                      <a
                        href={getProjectGithubUrl(project)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub ↗
                      </a>


                      {project.liveUrl && (

                        <a
                          href={
                            project.liveUrl
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          Live Demo ↗
                        </a>

                      )}

                    </div>

                  </article>

                )
              )}

            </div>

          )}

      </section>


      {/* =====================================
          ABOUT SECTION
      ===================================== */}

      <section
        className="about container"
        id="about"
      >

        <div className="section-heading" data-reveal="fade-up">

          <p className="eyebrow">
            A little about me
          </p>

          <h2>
            A bit
            <br />
            about me.
          </h2>

        </div>


        <div className="about-content">

          <div className="about-text" data-reveal="fade-left">

            <p>
              I&apos;m Angshu — a CSE student
              and MERN full-stack web
              developer who enjoys turning
              ideas into clean, useful,
              and engaging digital
              experiences.
            </p>


            <p>
              I&apos;m currently focused on
              improving my frontend skills,
              building full-stack projects,
              and creating interfaces that
              are simple, functional,
              and enjoyable to use.
            </p>

          </div>


          <div className="about-details" data-reveal="fade-right">

            <div className="detail">

              <span>
                Role
              </span>

              <p>
                Full-Stack Developer
              </p>

            </div>


            <div className="detail">

              <span>
                Focus
              </span>

              <p>
                Web Development & UI/UX
              </p>

            </div>


            <div className="detail">

              <span>
                Stack
              </span>

              <p>
                MongoDB · Express · React · Node
              </p>

            </div>


            <div className="detail">

              <span>
                Status
              </span>

              <p>
                Open to opportunities
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================
          CONTACT SECTION
      ===================================== */}

      <section
        className="contact-section container"
        id="contact"
      >

        <div className="contact-intro" data-reveal="fade-left">

          <p className="eyebrow">
            Have a project in mind?
          </p>

          <h2>
            Let&apos;s make something worth using.
          </h2>

          <p>
            Send a note and I&apos;ll get back
            to you soon.
          </p>

        </div>


        <form
          className="contact-form"
          onSubmit={submitContact}
          data-reveal="fade-right"
        >

          {/* Name */}

          <label>

            Name

            <input
              name="name"
              value={form.name}
              onChange={updateField}
              required
              maxLength="80"
              placeholder="Your name"
            />

          </label>


          {/* Email */}

          <label>

            Email

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={updateField}
              required
              maxLength="160"
              placeholder="you@example.com"
            />

          </label>


          {/* Message */}

          <label>

            Message

            <textarea
              name="message"
              value={form.message}
              onChange={updateField}
              required
              maxLength="2000"
              rows="5"
              placeholder="Tell me a little about the project"
            />

          </label>


          {/* Submit */}

          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >

            {isSubmitting
              ? 'Sending...'
              : 'Send message ↗'}

          </button>


          {/* Status */}

          {status.message && (

            <p
              className={`form-status ${status.type}`}
              role="status"
            >
              {status.message}
            </p>

          )}

        </form>

      </section>


      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="footer container" data-reveal="fade-up">

        <span>
          © 2026 Angshu Saha
        </span>

        <a href="#top">
          Back to top ↑
        </a>

      </footer>

    </main>
  )
}

export default App
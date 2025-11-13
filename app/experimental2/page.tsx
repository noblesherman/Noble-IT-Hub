"use client"

import { useEffect } from "react"
import Script from "next/script"

export default function NobleWebDesignsPage() {
  // Ensure body has js class like original
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.add("js")
    }
  }, [])

  return (
    <>
      {/* Core scripts from original stack */}
      <Script src="/js/siema.min.js" strategy="beforeInteractive" />
      <Script src="/js/lazysizes.min.js" strategy="beforeInteractive" />
      <Script src="/js/inview.js" strategy="afterInteractive" />
      <Script src="/js/sidescroll.js" strategy="afterInteractive" />
      <Script src="/js/nav.js" strategy="afterInteractive" />
      <Script src="/js/page-home.js" strategy="afterInteractive" />
      {/* optional analytics */}
      {/* <Script src="/js/simple-analytics.js" strategy="afterInteractive" /> */}
      {/* <Script src="/js/latest.js" strategy="afterInteractive" /> */}

      <div className="page page-home">

        {/* Top nav / logo, text changed to Noble Web Designs */}
        <header className="site-header">
          <div className="container container--lg nav__inner">
            <div className="site-logo-wrapper">
              <a href="#top" className="site-logo" data-logo>
                <span className="site-logo__word">Noble</span>
                <span className="site-logo__word">Web</span>
                <span className="site-logo__word">Designs</span>
              </a>
            </div>

            <input
              id="nav-check"
              type="checkbox"
              className="nav-check"
              aria-label="Toggle navigation"
            />
            <label htmlFor="nav-check" className="nav-toggle">
              <span />
              <span />
            </label>

            <nav className="nav">
              <div className="nav__inner">
                <div className="nav__block">
                  <p className="nav-label">Studio</p>
                  <ul>
                    <li>
                      <a href="#who">About Noble</a>
                    </li>
                    <li>
                      <a href="#work">Selected work</a>
                    </li>
                  </ul>
                </div>
                <div className="nav__block">
                  <p className="nav-label">Services</p>
                  <ul>
                    <li>
                      <a href="#how">Process</a>
                    </li>
                    <li>
                      <a href="#contact">Start a project</a>
                    </li>
                  </ul>
                </div>
                <div className="nav__block">
                  <p className="nav-label">Contact</p>
                  <ul>
                    <li>
                      <a href="mailto:hello@noblewebdesigns.com">
                        hello@noblewebdesigns.com
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
          </div>
        </header>

        <main>

          {/* HERO TITLE + SHAPES (ties into home-shapes + inview logic) */}
          <section id="top" className="title-shapes">

            <div className="container container--lg">
              <div className="title">
                <h1 className="rise-title">
                  <span>Noble</span>
                  <span>Web</span>
                  <span>Designs</span>
                </h1>
                <p className="title-sub">
                  Scroll only studio for bold, fast, conversion focused websites.
                </p>
              </div>
            </div>

            <div className="home-shapes" data-listener="inviewShapes">
              {/* You drop your SVGs here, same as original, now branded Noble */}
            </div>

          </section>

          {/* INTRO BLOCK LIKE ORIGINAL, REBRANDED */}
          <section
            id="who"
            className="section intro"
            data-listener="inview"
          >
            <div className="container container--lg intro__inner">
              <div className="intro__col intro__col--text">
                <h2 className="intro__title">
                  Noble Web Designs is a one person studio creating loud,
                  structured, scroll native sites for small teams, studios and
                  nonprofits.
                </h2>
                <p className="intro__text">
                  No templates, no polite beige. Custom builds that behave well
                  on weak devices, load quickly, and move visitors to action
                  using a single gesture, scroll.
                </p>
              </div>
              <div className="intro__col intro__col--side">
                <p className="intro__label">
                  Based online, working worldwide. Limited projects. High effort.
                </p>
              </div>
            </div>
          </section>

          {/* HORIZONTAL SIDESCROLL SECTION (STRUCTURE FOR sidescroll.js) */}
          <section
            className="sidescroll"
            data-listener="inviewSidescroll"
          >
            <div className="sidescroll__sticky">
              <div className="sidescroll__inner h-scroller">
                <div className="sidescroll__panel sidescroll__panel--yellow">
                  <div className="container container--lg">
                    <h3>
                      Design that feels like a poster,
                      built to sell like a funnel.
                    </h3>
                    <p>
                      Noble leans into strong color, giant type, motion and rhythm,
                      while keeping one clear story on screen.
                    </p>
                  </div>
                </div>
                <div className="sidescroll__panel sidescroll__panel--green">
                  <div className="container container--lg">
                    <h3>Built lean in Next.js or WordPress</h3>
                    <p>
                      Fast, minimal, maintainable. No drag and drop noise.
                      Your site can breathe and still hit metrics.
                    </p>
                  </div>
                </div>
                <div className="sidescroll__panel sidescroll__panel--orange">
                  <div className="container container--lg">
                    <h3>Made for clients who hate boring</h3>
                    <p>
                      Nonprofits, coaches, studios, logistics, education.
                      If you want your site to look alive, this is for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STACKED POSTER STYLE SECTION */}
          <section
            id="work"
            className="section section-posters"
            data-listener="inview"
          >
            <div className="container container--lg">
              <div className="poster-grid">
                <div className="poster poster--dark">
                  <p className="poster-label">Selected work</p>
                  <h3>Noble sites for real orgs</h3>
                  <p>
                    Landing pages for launches, full brand builds,
                    scroll stories for campaigns.
                  </p>
                </div>
                <div className="poster poster--light">
                  <h4>Nonprofit</h4>
                  <p>
                    Built a scroll narrative for a food access org,
                    made donating effortless and very hard to ignore.
                  </p>
                </div>
                <div className="poster poster--light">
                  <h4>Studio collabs</h4>
                  <p>
                    White label builds for creative studios who want motion heavy
                    work without adding a full time dev.
                  </p>
                </div>
                <div className="poster poster--light">
                  <h4>Single founder brands</h4>
                  <p>
                    One page sites that do what five page sites pretend to do.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* PROCESS / ACCORDION USING YOUR ACCORDION CSS */}
          <section
            id="how"
            className="section section-process"
            data-listener="inview"
          >
            <div className="container container--lg">
              <h2 className="section-title">
                How Noble Web Designs works
              </h2>
              <div className="accordion">
                <details open>
                  <summary>
                    1. Short call, clear goal
                  </summary>
                  <div>
                    Define what the site must do, not what it must “look like”.
                  </div>
                </details>
                <details>
                  <summary>
                    2. Direction and layout
                  </summary>
                  <div>
                    Color, type, rhythm, scroll structure, no fluff.
                  </div>
                </details>
                <details>
                  <summary>
                    3. Build and refine
                  </summary>
                  <div>
                    You see live previews, sections lock in, performance checked.
                  </div>
                </details>
                <details>
                  <summary>
                    4. Launch and support
                  </summary>
                  <div>
                    Domain, hosting, tracking, forms, and a bit of post launch care.
                  </div>
                </details>
              </div>
            </div>
          </section>

          {/* CONTACT CTA, STILL IN CHARACTER */}
          <section
            id="contact"
            className="section section-contact"
            data-listener="inview"
          >
            <div className="container container--lg">
              <div className="contact-block">
                <h2>
                  If this page made sense to you,
                  you are the Noble Web Designs client.
                </h2>
                <p>
                  Send your current link, what you do,
                  and your timeline for launch.
                  You get a focused concept and a clear fixed price.
                </p>
                <a
                  className="btn"
                  href="mailto:hello@noblewebdesigns.com?subject=Noble%20Web%20Designs%20Project"
                >
                  hello@noblewebdesigns.com
                </a>
                <p className="contact-note">
                  Limited projects at a time. High effort, no beige.
                </p>
              </div>
            </div>
          </section>

        </main>

        <footer className="site-footer">
          <div className="container container--lg footer__inner">
            <p className="footer__copy">
              © {new Date().getFullYear()} Noble Web Designs
            </p>
            <p className="footer__note">
              Scroll only, no patience for boring.
            </p>
          </div>
        </footer>
      </div>
    </>
  )
}
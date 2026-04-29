import { Link } from 'react-router-dom'
import Slideshow from '../components/Slideshow.jsx'

// TODO: replace these placeholder values with Phil's real details
const PERSON = {
  name: 'Philip Morrall',       // TODO: full name
  dates: '1951 – 2026',          // TODO: birth and death year
  quote: 'Traveller, adventurer, lover of life. Beloved partner of Nelius, brother to Anne and Andrew, and friend to many.', // TODO: a meaningful quote or epitaph
  quoteAuthor: null,              // TODO: add attribution if the quote has a source
}

export default function Home() {
  return (
    <section className="hero">
      <div className="hero__slideshow-bg">
        <Slideshow />
      </div>
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__name">{PERSON.name}</h1>
        <p className="hero__dates">{PERSON.dates}</p>
        <blockquote className="hero__quote">
          {PERSON.quote}
          {PERSON.quoteAuthor && <cite>— {PERSON.quoteAuthor}</cite>}
        </blockquote>
        <div className="hero__nav-links">
          <Link to="/memories" className="btn btn--primary">Read memories</Link>
          <Link to="/gallery"  className="btn btn--outline">View gallery</Link>
        </div>
      </div>
    </section>
  )
}

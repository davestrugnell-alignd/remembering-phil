import MemoryWall from '../components/MemoryWall.jsx'
import MemoryForm from '../components/MemoryForm.jsx'

export default function Memories() {
  return (
    <div className="page-container">
      <div className="two-col">
        {/* Left column — the wall of submitted memories */}
        <section>
          <h2 className="section-title">Memories</h2>
          <p className="section-subtitle">
            Words shared by those whose lives Phil touched.
          </p>
          <MemoryWall />
        </section>

        {/* Right column — the submission form */}
        <section>
          <h2 className="section-title">Share yours</h2>
          <p className="section-subtitle">
            Your tribute will appear here after a brief review.
          </p>
          <MemoryForm />
        </section>
      </div>
    </div>
  )
}

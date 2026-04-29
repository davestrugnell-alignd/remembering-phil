import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import AudioPlayer from './components/AudioPlayer.jsx'
import Home from './pages/Home.jsx'
import Memories from './pages/Memories.jsx'
import Gallery from './pages/Gallery.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/memories" element={<Memories />} />
          <Route path="/gallery" element={<Gallery />} />
        </Routes>
      </main>
      <AudioPlayer />
    </>
  )
}

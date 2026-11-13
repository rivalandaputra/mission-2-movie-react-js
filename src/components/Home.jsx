// ========================================
// 1. IMPORT
// ========================================

// Import Hook React
import { useState } from 'react'

// Import data film
import {
  continueWatchingMovies,
  topRatingMovies,
  trendingMovies,
  newReleaseMovies,
} from '../data/movies'

// Import assets
import heroImage from '../assets/moana.jpg'
import moanaLogo from '../assets/logo-moana.png'

// Import komponen
import MyList from './MyList'
import Navbar from './NavbarTemp'
import ContinueWatching from './ContinueWatching'
import MovieCard from './MovieCard'
import MovieSection from './MovieSection'
import Footer from './Footer'


// ========================================
// 2. KOMPONEN HOME
// Mengatur halaman utama aplikasi CHILL.
// ========================================

function Home() {

  // ========================================
  // 2.1 STATE
  // Mengelola pencarian dan Daftar Saya.
  // ========================================

  // State pencarian film
  const [searchTerm, setSearchTerm] = useState('')

  // State Daftar Saya dari localStorage
  const [savedMovies, setSavedMovies] = useState(() => {
    const saved = localStorage.getItem('myList')

    return saved ? JSON.parse(saved) : []
  })


  // ========================================
  // 2.2 DATA FILM
  // Menggabungkan seluruh kategori film.
  // ========================================

  const allMovies = [
    ...new Map(
      [
        ...continueWatchingMovies,
        ...topRatingMovies,
        ...trendingMovies,
        ...newReleaseMovies,
      ].map((movie) => [
        movie.title.toLowerCase().trim(),
        movie,
      ])
    ).values(),
  ]


  // ========================================
  // 2.3 PENCARIAN FILM
  // Memfilter film berdasarkan judul.
  // ========================================

  const filteredMovies = allMovies.filter((movie) =>
    movie.title
      .toLowerCase()
      .includes(searchTerm.trim().toLowerCase())
  )

  const isSearching = searchTerm.trim() !== ''


  // ========================================
  // 3. FUNGSI CRUD
  // Mengelola data pada Daftar Saya.
  // ========================================

  // CREATE
  // Menambahkan film ke Daftar Saya.
  function handleAddToList(movie) {
    const movieKey = movie.movieKey || movie.id

    // Memeriksa apakah film sudah tersimpan.
    const alreadySaved = savedMovies.some(
      (savedMovie) =>
        (savedMovie.movieKey || savedMovie.id) === movieKey
    )

    if (alreadySaved) return

    // Menambahkan film ke daftar.
    const updatedList = [...savedMovies, movie]

    setSavedMovies(updatedList)
    localStorage.setItem('myList', JSON.stringify(updatedList))
  }


  // UPDATE
  // Mengubah status tontonan film.
  function handleUpdateStatus(movieKey, newStatus) {
    const updatedList = savedMovies.map((movie) => {
      const currentKey = movie.movieKey || movie.id

      if (currentKey === movieKey) {
        return {
          ...movie,
          status: newStatus,
        }
      }

      return movie
    })

    setSavedMovies(updatedList)
    localStorage.setItem('myList', JSON.stringify(updatedList))
  }


  // DELETE
  // Menghapus film dari Daftar Saya.
  function handleRemoveFromList(movieKey) {
    const updatedList = savedMovies.filter(
      (movie) =>
        (movie.movieKey || movie.id) !== movieKey
    )

    setSavedMovies(updatedList)
    localStorage.setItem('myList', JSON.stringify(updatedList))
  }


  // ========================================
  // 4. TAMPILAN HALAMAN HOME
  // ========================================

  return (
    <div className="home-page" id="top">

      {/* Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="home-content">

        {/* ========================================
            4.1 HERO DAN LANJUT TONTON
            Ditampilkan ketika tidak sedang mencari.
        ======================================== */}

        {!isSearching && (
          <>

            {/* Hero Section */}
            <section
              className="hero-section"
              style={{ backgroundImage: `url(${heroImage})` }}
            >
              <div className="hero-overlay">

                {/* Logo film */}
                <img
                  src={moanaLogo}
                  alt="Moana"
                  className="hero-title-logo"
                />

                {/* Deskripsi film */}
                <p>
                  Teenage Moana answers the Ocean's call and, for the
                  first time, voyages beyond the reef of her island of
                  Motunui with infamous demigod Maui on an unforgettable
                  journey to restore prosperity to her people.
                </p>

                {/* Tombol Hero */}
                <div className="hero-buttons">
                  <button
                    type="button"
                    className="hero-button"
                  >
                    Mulai Tonton
                  </button>

                  <button
                    type="button"
                    className="hero-info-button"
                  >
                    ℹ Selengkapnya
                  </button>
                </div>

              </div>
            </section>


            {/* Continue Watching */}
            <ContinueWatching
              movies={continueWatchingMovies}
              onAddToList={handleAddToList}
              savedMovies={savedMovies}
              onRemoveFromList={handleRemoveFromList}
            />

          </>
        )}


        {/* ========================================
            4.2 HASIL PENCARIAN
            Menampilkan film sesuai kata kunci.
        ======================================== */}

        {isSearching && (
          <section className="movie-section search-results">

            <h2>Hasil Pencarian</h2>

            {filteredMovies.length > 0 ? (

              <div className="movie-list">

                {filteredMovies.map((movie) => {
                  const movieKey = movie.movieKey || movie.id

                  // Memeriksa status penyimpanan film.
                  const isSaved = savedMovies.some(
                    (savedMovie) =>
                      (savedMovie.movieKey || savedMovie.id) === movieKey
                  )

                  return (
                    <MovieCard
                      key={movieKey}
                      movie={movie}
                      onAddToList={handleAddToList}
                      onRemoveFromList={handleRemoveFromList}
                      isSaved={isSaved}
                    />
                  )
                })}

              </div>

            ) : (
              <p>Film tidak ditemukan.</p>
            )}

          </section>
        )}


        {/* ========================================
            4.3 KATEGORI FILM DAN DAFTAR SAYA
            Ditampilkan ketika tidak sedang mencari.
        ======================================== */}

        {!isSearching && (
          <>

            {/* Top Rating */}
            <MovieSection
              id="series"
              title="Top Rating Film dan Series Hari Ini"
              movies={topRatingMovies}
              onAddToList={handleAddToList}
              savedMovies={savedMovies}
              onRemoveFromList={handleRemoveFromList}
            />


            {/* Film Trending */}
            <MovieSection
              id="film"
              title="Film Trending"
              movies={trendingMovies}
              onAddToList={handleAddToList}
              savedMovies={savedMovies}
              onRemoveFromList={handleRemoveFromList}
            />


            {/* Rilis Baru */}
            <MovieSection
              title="Rilis Baru"
              movies={newReleaseMovies}
              onAddToList={handleAddToList}
              savedMovies={savedMovies}
              onRemoveFromList={handleRemoveFromList}
            />


            {/* Daftar Saya */}
            <MyList
              savedMovies={savedMovies}
              onRemoveFromList={handleRemoveFromList}
              onUpdateStatus={handleUpdateStatus}
            />

          </>
        )}

      </main>


      {/* Footer */}
      <Footer />

    </div>
  )
}


// ========================================
// 5. EXPORT KOMPONEN
// ========================================

export default Home

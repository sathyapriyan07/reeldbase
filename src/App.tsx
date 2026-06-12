import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/hooks/useAuth'
import PublicLayout from '@/components/layout/PublicLayout'
import AdminLayout from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/layout/ProtectedRoute'

import Home from '@/pages/public/Home'
import Discover from '@/pages/public/Discover'
import MovieDetail from '@/pages/public/MovieDetail'
import SeriesDetail from '@/pages/public/SeriesDetail'
import PersonDetail from '@/pages/public/PersonDetail'
import SearchResults from '@/pages/public/SearchResults'
import Login from '@/pages/auth/Login'
import Signup from '@/pages/auth/Signup'

import AdminDashboard from '@/pages/admin/Dashboard'
import AdminMovies from '@/pages/admin/Movies'
import AdminMovieEdit from '@/pages/admin/MovieEdit'
import AdminSeries from '@/pages/admin/Series'
import AdminSeriesEdit from '@/pages/admin/SeriesEdit'
import AdminPeople from '@/pages/admin/People'
import AdminPersonEdit from '@/pages/admin/PersonEdit'
import AdminGenres from '@/pages/admin/Genres'
import AdminLanguages from '@/pages/admin/Languages'
import AdminCompanies from '@/pages/admin/Companies'
import AdminReviews from '@/pages/admin/Reviews'
import AdminHomeSections from '@/pages/admin/HomeSections'
import AdminMedia from '@/pages/admin/Media'
import AdminTMDBImport from '@/pages/admin/TMDBImport'
import AdminTags from '@/pages/admin/Tags'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/movie/:slug" element={<MovieDetail />} />
          <Route path="/series/:slug" element={<SeriesDetail />} />
          <Route path="/person/:slug" element={<PersonDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<AdminDashboard />} />
          <Route path="movies" element={<AdminMovies />} />
          <Route path="movies/new" element={<AdminMovieEdit />} />
          <Route path="movies/:id/edit" element={<AdminMovieEdit />} />
          <Route path="series" element={<AdminSeries />} />
          <Route path="series/new" element={<AdminSeriesEdit />} />
          <Route path="series/:id/edit" element={<AdminSeriesEdit />} />
          <Route path="people" element={<AdminPeople />} />
          <Route path="people/new" element={<AdminPersonEdit />} />
          <Route path="people/:id/edit" element={<AdminPersonEdit />} />
          <Route path="genres" element={<AdminGenres />} />
          <Route path="languages" element={<AdminLanguages />} />
          <Route path="companies" element={<AdminCompanies />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="home-sections" element={<AdminHomeSections />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="tmdb-import" element={<AdminTMDBImport />} />
          <Route path="tags" element={<AdminTags />} />
        </Route>
      </Routes>
    </AuthProvider>
  )
}

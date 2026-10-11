
import { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import "./App.css"
import Navbar from "./components/Navbar"
import PhoneCard from "./components/PhoneCard"
import PhoneDetails from "./pages/PhoneDetails"
import AdminLogin from "./pages/AdminLogin"
import AdminDashboard from "./pages/AdminDashboard"
import AddPhone from "./pages/AddPhone"
import UpdatePhone from "./pages/UpdatePhone"

import { API_BASE_URL } from "./api";


function Home() {
  const [phones, setPhones] = useState([])
  const [keyword, setKeyword] = useState("")
  const [condition, setCondition] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

 
function fetchPhones(url = `${API_BASE_URL}/phones`) {
  setLoading(true);
  setError("");

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Unable to load phones.");
      }
      return response.json();
    })
    .then(data => {
      setPhones(data);
    })
    .catch(err => {
      console.error(err);
      setError("Could not load phones. Please check the backend.");
    })
    .finally(() => setLoading(false));
}

  useEffect(() => {
    fetchPhones()
  }, [])

 
function searchPhones(event) {
  event?.preventDefault();

  const trimmedKeyword = keyword.trim();

  if (trimmedKeyword === "") {
    if (condition) {
      fetchPhones(
        `${API_BASE_URL}/phones/condition?condition=${encodeURIComponent(condition)}`
      );
    } else {
      fetchPhones();
    }
    return;
  }

  fetchPhones(
    `${API_BASE_URL}/phones/search?keyword=${encodeURIComponent(trimmedKeyword)}`
  );
}


 
function filterByCondition(selectedCondition) {
  setCondition(selectedCondition);

  if (selectedCondition === "") {
    fetchPhones();
    return;
  }

  fetchPhones(
    `${API_BASE_URL}/phones/condition?condition=${encodeURIComponent(selectedCondition)}`
  );
}


  function resetFilters() {
    setKeyword("")
    setCondition("")
    fetchPhones()
  }

  return (
    <div className="home-page">
      <section className="home-hero">
        <span className="home-eyebrow">
          TECH • STYLE • TRUST
        </span>

        <h1>
          Find your next
          <br />
          <span>perfect phone.</span>
        </h1>

        <p>
          Explore smartphones that match your style and budget.
          Compare new and pre-owned phones in one place.
        </p>
      </section>

      <main className="home-content">
        <div className="catalog-heading">
          <div>
            <h2>Explore Phones</h2>
            <p>Find the right device for you.</p>
          </div>
        </div>

        <div className="phone-toolbar">
          <form className="search-box" onSubmit={searchPhones}>
            <input
              type="text"
              placeholder="Search by brand or model..."
              value={keyword}
              onChange={event => setKeyword(event.target.value)}
            />

            <button type="submit">Search</button>
          </form>

          <select
            aria-label="Filter phones by condition"
            value={condition}
            onChange={event => filterByCondition(event.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="NEW">New Phones</option>
            <option value="USED">Used Phones</option>
          </select>

          <button type="button" onClick={resetFilters}>
            Reset
          </button>
        </div>

        {loading && (
          <div className="empty-phones">
            Loading phones...
          </div>
        )}

        {!loading && error && (
          <div className="empty-phones">
            <p>{error}</p>
            <button onClick={() => fetchPhones()}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && phones.length === 0 && (
          <div className="empty-phones">
            <h3>No phones found</h3>
            <p>Try another search or change the condition filter.</p>
            <button onClick={resetFilters}>
              Show All Phones
            </button>
          </div>
        )}

        {!loading && !error && phones.length > 0 && (
          <>
            <p className="phone-result-count">
              Showing {phones.length} {phones.length === 1 ? "phone" : "phones"}
            </p>

            <div className="phone-list">
              {phones.map(phone => (
                <PhoneCard
                  key={phone.id}
                  phone={phone}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/phones/:id" element={<PhoneDetails />} />
        <Route path="/admin/update-phone/:id" element={<UpdatePhone />} />
        <Route path="/admin/add-phone" element={<AddPhone />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

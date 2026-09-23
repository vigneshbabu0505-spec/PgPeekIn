import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import "../../styles/Tenant.css";
import logo from "../../assets/pgpeekin-logo.png";

import { apiRequest } from "../../api/api";

function SearchPG() {

    const location = useLocation();

    const params = new URLSearchParams(location.search);

    const initialLocation =
        params.get("location") || "";

    const [searchText, setSearchText] =
        useState(initialLocation);

    const [searchedLocation, setSearchedLocation] =
        useState(initialLocation);

    const [pgs, setPgs] =
        useState([]);
    
    const [pgPhotos, setPgPhotos] =
    useState({});

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    // -----------------------------
    // FILTER STATES
    // -----------------------------

    const [sharingType, setSharingType] =
        useState("");

    const [priceRange, setPriceRange] =
        useState("");

    // -----------------------------
    // LOGGED-IN USER
    // -----------------------------

    const [currentUser, setCurrentUser] =
        useState(null);

    useEffect(() => {

        try {

            const storedUser =
                localStorage.getItem("user");

            if (storedUser) {

                const user =
                    JSON.parse(storedUser);

                setCurrentUser(user);
            }

        } catch (error) {

            console.error(
                "Unable to read logged-in user:",
                error
            );

        }

    }, []);

    // -----------------------------
    // INITIAL SEARCH
    // -----------------------------

    useEffect(() => {

        if (initialLocation.trim()) {

            searchPGs(
                initialLocation.trim()
            );

        }

    }, []);

    const fetchPGPhotos = async (pgList) => {

    const photoMap = {};

    await Promise.all(
        pgList.map(async (pg) => {

            try {

                const photos = await apiRequest(
                    `/api/tenant/pg/${pg.pgid}/photos`
                );

                if (
                    photos &&
                    photos.length > 0 &&
                    photos[0].photoPath
                ) {

                    photoMap[pg.pgid] =
                        photos[0].photoPath;

                }

            } catch (error) {

                console.error(
                    `Unable to fetch photos for PG ${pg.pgid}:`,
                    error
                );

            }

        })
    );

    setPgPhotos(photoMap);
};

    // -----------------------------
    // SEARCH PGs
    // -----------------------------

    const searchPGs = async (locationValue) => {

        try {

            setLoading(true);
            setError("");

            console.log(
                "Searching PGs:",
                locationValue
            );

            const queryParams =
                new URLSearchParams();

            if (locationValue) {
                queryParams.append(
                    "location",
                    locationValue
                );
            }

            // Sharing type
            if (sharingType) {

                queryParams.append(
                    "sharingType",
                    sharingType
                );

            }

            // Price range
            if (priceRange) {

                if (priceRange === "under5000") {

                    queryParams.append(
                        "maxPrice",
                        "5000"
                    );

                }

                else if (priceRange === "5000-8000") {

                    queryParams.append(
                        "minPrice",
                        "5000"
                    );

                    queryParams.append(
                        "maxPrice",
                        "8000"
                    );

                }

                else if (priceRange === "8000-12000") {

                    queryParams.append(
                        "minPrice",
                        "8000"
                    );

                    queryParams.append(
                        "maxPrice",
                        "12000"
                    );

                }

                else if (priceRange === "12000-15000") {

                    queryParams.append(
                        "minPrice",
                        "12000"
                    );

                    queryParams.append(
                        "maxPrice",
                        "15000"
                    );

                }

                else if (priceRange === "above15000") {

                    queryParams.append(
                        "minPrice",
                        "15000"
                    );

                }

            }

            const endpoint =
                `/api/tenant/search?${queryParams.toString()}`;

            console.log(
                "Search endpoint:",
                endpoint
            );

            const data =
                await apiRequest(endpoint);

            console.log(
                "PG search result:",
                data
            );

            setPgs(data);

            setSearchedLocation(
                locationValue
            );
            await fetchPGPhotos(data);

        }

        catch (error) {

            console.error(
                "PG search error:",
                error
            );

            setPgs([]);

            setError(
                error.message ||
                "Unable to search PGs."
            );

        }

        finally {

            setLoading(false);

        }

    };

    // -----------------------------
    // HANDLE SEARCH
    // -----------------------------

    const handleSearch = async (e) => {

        e.preventDefault();

        const locationValue =
            searchText.trim();

        if (!locationValue) {

            alert(
                "Please enter a city, area or PG name."
            );

            return;
        }

        await searchPGs(
            locationValue
        );

    };

    // -----------------------------
    // CLEAR SEARCH
    // -----------------------------

    const clearSearch = () => {

        setSearchText("");

        setSearchedLocation("");

        setPgs([]);

        setError("");

        setSharingType("");

        setPriceRange("");

    };

    // -----------------------------
    // APPLY FILTERS
    // -----------------------------

    const handleFilterChange = async () => {

        const locationValue =
            searchText.trim();

        if (!locationValue) {

            alert(
                "Please enter a city, area or PG name."
            );

            return;

        }

        await searchPGs(
            locationValue
        );

    };

    // -----------------------------
    // USER DETAILS
    // -----------------------------

    const userName =
        currentUser?.user_name ||
        currentUser?.name ||
        "Tenant";

    const userRole =
        currentUser?.role ||
        "tenant";

    const userInitial =
        userName
            .charAt(0)
            .toUpperCase();

    // -----------------------------
    // UI
    // -----------------------------

    return (

        <div className="tenant-page">

            {/* SIDEBAR */}

            <aside className="tenant-sidebar">

                <div className="tenant-brand">

                    <img
                        src={logo}
                        alt="PGPeekIn"
                    />

                    <div>

                        <h2>
                            PGPeekIn
                        </h2>

                        <p>
                            Tenant panel
                        </p>

                    </div>

                </div>

                <nav className="tenant-menu">

                    <Link to="/tenant-dashboard">

                        <span>
                            ⌂
                        </span>

                        Dashboard

                    </Link>

                    <Link
                        to="/tenant/search-pg"
                        className="active"
                    >

                        <span>
                            ⌕
                        </span>

                        Search PG

                    </Link>

                    <Link to="/tenant/bookings">

                        <span>
                            ▣
                        </span>

                        My bookings

                    </Link>

                    <Link to="/tenant/reviews">

                        <span>
                            ☆
                        </span>

                        My reviews

                    </Link>

                    <Link to="/tenant/profile">

                        <span>
                            ♙
                        </span>

                        My profile

                    </Link>

                </nav>

                <Link
                    to="/login"
                    className="tenant-logout"
                >

                    <span>
                        ⇥
                    </span>

                    Log out

                </Link>

            </aside>

            {/* MAIN */}

            <main className="tenant-main">

                {/* HEADER */}

                <header className="tenant-header">

                    <div>

                        <h1>
                            Find your next stay
                        </h1>

                        <p>
                            Search PGs by city, sharing type and price.
                        </p>

                    </div>

                    {/* ACTUAL USER */}

                    <div className="tenant-user">

                        <div className="tenant-avatar">

                            {userInitial}

                        </div>

                        <div>

                            <strong>
                                {userName}
                            </strong>

                            <span>
                                {userRole}
                            </span>

                        </div>

                    </div>

                </header>

                {/* SEARCH HERO */}

                <section className="pg-search-hero">

                    <div className="pg-search-hero-content">

                        <div className="pg-search-icon">
                            ⌕
                        </div>

                        <div>

                            <h2>
                                Where do you want to stay?
                            </h2>

                            <p>
                                Search by location, sharing type and monthly rent.
                            </p>

                        </div>

                    </div>

                    <form
                        className="pg-search-form"
                        onSubmit={handleSearch}
                    >

                        {/* LOCATION */}

                        <div className="pg-search-input">

                            <span>
                                ⌖
                            </span>

                            <input
                                type="text"
                                placeholder="Search Chennai, Adyar, Velachery..."
                                value={searchText}
                                onChange={(e) =>
                                    setSearchText(
                                        e.target.value
                                    )
                                }
                            />

                            {searchText && (

                                <button
                                    type="button"
                                    className="clear-search"
                                    onClick={clearSearch}
                                >
                                    ×
                                </button>

                            )}

                        </div>

                        {/* SHARING */}

                        <select
                            className="pg-filter-select"
                            value={sharingType}
                            onChange={(e) =>
                                setSharingType(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Any sharing
                            </option>

                            <option value="1">
                                1 Sharing
                            </option>

                            <option value="2">
                                2 Sharing
                            </option>

                            <option value="3">
                                3 Sharing
                            </option>

                            <option value="4">
                                4 Sharing
                            </option>

                        </select>

                        {/* PRICE */}

                        <select
                            className="pg-filter-select"
                            value={priceRange}
                            onChange={(e) =>
                                setPriceRange(
                                    e.target.value
                                )
                            }
                        >

                            <option value="">
                                Any price
                            </option>

                            <option value="under5000">
                                Under ₹5,000
                            </option>

                            <option value="5000-8000">
                                ₹5,000 - ₹8,000
                            </option>

                            <option value="8000-12000">
                                ₹8,000 - ₹12,000
                            </option>

                            <option value="12000-15000">
                                ₹12,000 - ₹15,000
                            </option>

                            <option value="above15000">
                                Above ₹15,000
                            </option>

                        </select>

                        {/* SEARCH BUTTON */}

                        <button
                            type="submit"
                            className="pg-search-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Searching..."
                                : "Search PG"}

                        </button>

                    </form>

                    {/* FILTER APPLY BUTTON */}

                    <div className="pg-filter-actions">

                        <button
                            type="button"
                            className="pg-apply-filter-button"
                            onClick={handleFilterChange}
                            disabled={loading}
                        >
                            {loading
                                ? "Applying..."
                                : "Apply Filters"}
                        </button>

                    </div>

                </section>

                {/* RESULT HEADER */}

                <section className="pg-results-header">

                    <div>

                        <p className="pg-results-label">

                            {searchedLocation

                                ? `SEARCH RESULTS FOR "${searchedLocation.toUpperCase()}"`

                                : "SEARCH FOR A PG"}

                        </p>

                        <h2>

                            {loading

                                ? "Searching..."

                                : `${pgs.length} properties found`}

                        </h2>

                    </div>

                    <div className="pg-result-location">

                        <span>
                            ⌖
                        </span>

                        {searchedLocation ||
                            "Enter a location"}

                    </div>

                </section>

                {/* ERROR */}

                {error && (

                    <div className="pg-empty-state">

                        <div className="empty-icon">
                            !
                        </div>

                        <h3>
                            Unable to search PGs
                        </h3>

                        <p>
                            {error}
                        </p>

                        <button
                            className="pg-search-button"
                            onClick={() =>
                                searchedLocation &&
                                searchPGs(
                                    searchedLocation
                                )
                            }
                        >
                            Try Again
                        </button>

                    </div>

                )}

                {/* LOADING */}

                {loading && !error && (

                    <div className="pg-empty-state">

                        <div className="empty-icon">
                            ⌕
                        </div>

                        <h3>
                            Finding PGs...
                        </h3>

                        <p>
                            Searching available properties for you.
                        </p>

                    </div>

                )}

                {/* PG CARDS */}

                {!loading &&
                    !error &&
                    pgs.length > 0 && (

                        <section className="pg-list">

                            {pgs.map((pg) => (

                                <article
                                    className="pg-search-card"
                                    key={pg.pgid}
                                >

                                    {/* CARD VISUAL */}

                                    <div className="pg-card-visual">
                                        {pgPhotos[pg.pgid] ? (
                                            <img
                                            src={pgPhotos[pg.pgid]}
                                            alt={`${pg.pgname}`}
                                            className="pg-card-photo"/>
                                        ) : (
                                            <div className="pg-card-building">
                                                <span> 
                                                    PG
                                                </span>
                                            </div>
                                        )}
                                        <div className="pg-available-badge">
                                            <span></span>
                                            Available
                                            </div>
                                        </div>

                                    {/* CARD CONTENT */}

                                    <div className="pg-card-content">

                                        <div className="pg-card-heading">

                                            <div>

                                                <h3>
                                                    {pg.pgname}
                                                </h3>

                                                <p className="pg-location">
                                                    ⌖ {pg.area}, {pg.city}
                                                </p>

                                            </div>

                                            <span className="pg-type-badge">

                                                {pg.pgtype}

                                            </span>

                                        </div>

                                        <div className="pg-card-details">

                                            <div>

                                                <span>
                                                    Branch
                                                </span>

                                                <strong>
                                                    {pg.pgbranch || "N/A"}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Street
                                                </span>

                                                <strong>
                                                    {pg.street || "N/A"}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Pincode
                                                </span>

                                                <strong>
                                                    {pg.pincode || "N/A"}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="pg-card-footer">

                                            <div className="pg-phone">

                                                <span>
                                                    ☎
                                                </span>

                                                {pg.pgphnno || "N/A"}

                                            </div>

                                            <Link
                                                to={`/tenant/pg/${pg.pgid}`}
                                                className="pg-view-button"
                                            >

                                                View PG

                                                <span>
                                                    →
                                                </span>

                                            </Link>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </section>

                    )}

                {/* EMPTY */}

                {!loading &&
                    !error &&
                    searchedLocation &&
                    pgs.length === 0 && (

                        <div className="pg-empty-state">

                            <div className="empty-icon">
                                ⌕
                            </div>

                            <h3>
                                No PGs found
                            </h3>

                            <p>
                                We couldn't find a PG matching your location and selected filters.
                                Try changing the location, sharing type or price.
                            </p>

                        </div>

                    )}

            </main>

        </div>

    );

}

export default SearchPG;
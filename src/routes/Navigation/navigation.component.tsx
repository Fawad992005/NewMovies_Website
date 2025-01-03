import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../../store/userstore";
import { SignOutUser } from "../../utils/firebase/firebase.utils";

const Navigation = () => {
  const location = useLocation();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const SignOutHandler = () => {
    SignOutUser();
    navigate("/signin");
  };
  return (
    <>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <Link
            className="font-bold text-xl flex gap-0 tooltip tooltip-bottom"
            data-tip="Home"
            to="/"
          >
            <span className="text-black bg-yellow-300 rounded-sm pr-2 pl-2">
              New
            </span>
            <span className="text-yellow-300">Movies</span>
          </Link>
        </div>
        <div className="flex gap-3">
          <div className="dropdown dropdown-end flex md:hidden gap-3 ">
            <div
              tabIndex={0}
              role="button"
              className="btn  bg-yellow-300 text-black px-5 text-lg"
            >
              Menu
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-black rounded-box z-[1] w-52 p-2 shadow flex flex-col gap-6"
            >
              <li>
                <Link
                  to="/popularmovies"
                  role="tab"
                  className={`tab text-xl ${
                    location.pathname === "/popularmovies" ? "tab-active" : ""
                  }`}
                >
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/topratedmovies"
                  role="tab"
                  className={`tab text-xl ${
                    location.pathname === "/topratedmovies" ? "tab-active" : ""
                  }`}
                >
                  Top Rated Movies
                </Link>
              </li>
              <li>
                <Link
                  to="/search"
                  role="tab"
                  className={`tab text-xl ${
                    location.pathname === "/search" ? "tab-active" : ""
                  }`}
                >
                  Search Movies
                </Link>
              </li>
              <li>
                {!user && (
                  <Link
                    to="/signin"
                    className={`tooltip tooltip-bottom tab ${
                      location.pathname === "/signin" ? "tab-active" : ""
                    } text-xl`}
                    data-tip="Log In"
                    role="tab"
                  >
                    Log in
                  </Link>
                )}
              </li>
            </ul>
          </div>
          <div className="flex md:hidden">
            {user && (
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="Tailwind CSS Navbar component"
                      src="/profilepic.jpg"
                    />
                  </div>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
                >
                  <li>
                    <Link to="/watchlist">Wacthlist</Link>
                  </li>
                  <li>
                    <a onClick={SignOutHandler}>Logout</a>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="flex-none gap-3 hidden md:flex">
          <div className="flex gap-4 tabs tabs-bordered" role="tablist">
            <Link
              to="/popularmovies"
              role="tab"
              className={`tab text-xl ${
                location.pathname === "/popularmovies" ? "tab-active" : ""
              }`}
            >
              Popular Movies
            </Link>
            <Link
              to="/topratedmovies"
              role="tab"
              className={`tab text-xl ${
                location.pathname === "/topratedmovies" ? "tab-active" : ""
              }`}
            >
              Top Rated Movies
            </Link>
            <Link
              to="/search"
              role="tab"
              className={`tab text-xl ${
                location.pathname === "/search" ? "tab-active" : ""
              }`}
            >
              Search Movies
            </Link>
            {!user && (
              <Link
                to="/signin"
                className={`tooltip tooltip-bottom tab ${
                  location.pathname === "/signin" ? "tab-active" : ""
                } text-xl`}
                data-tip="Log In"
                role="tab"
              >
                Log in
              </Link>
            )}
          </div>
          {user && (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src="/profilepic.jpg"
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/watchlist">Wacthlist</Link>
                </li>
                <li>
                  <a onClick={SignOutHandler}>Logout</a>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* <div>
        <Link to="/">Home</Link>
        <div>
          <Link to="/signup">Signup</Link>
          <Link to="/signin">Signin</Link>
        </div>
      </div> */}
      <Outlet />
    </>
  );
};

export default Navigation;

// src/App.tsx
import { Routes, Route } from "react-router-dom";
// import Navigation from "./routes/Navigation/navigation.component";
// import Home from "./routes/Home/home.component";
// import Signin from "./routes/Signin/signin.component";
// import Signup from "./routes/Signup/signup.compomnent";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from "./utils/firebase/firebase.utils";
import React, { Suspense, useEffect } from "react";
import { User } from "firebase/auth";
import useUserStore from "./store/userstore";
// import PopularMoviesComponent from "./routes/popularmvoies/popularmovies";
// import MovieDetailsComponent from "./components/MovieDetails/movie.component";
// import TopratedMoviesComponent from "./routes/topratedmovies/topratedmovies.component";
// import SearchComponent from "./components/Search/search.component";
// import Watchlist from "./routes/watchlist/wacthlist.component";
const Navigation = React.lazy(
  () => import("./routes/Navigation/navigation.component")
);
const Home = React.lazy(() => import("./routes/Home/home.component"));
const Signin = React.lazy(() => import("./routes/Signin/signin.component"));
const Signup = React.lazy(() => import("./routes/Signup/signup.compomnent"));
const PopularMoviesComponent = React.lazy(
  () => import("./routes/popularmvoies/popularmovies")
);
const MovieDetailsComponent = React.lazy(
  () => import("./components/MovieDetails/movie.component")
);
const TopratedMoviesComponent = React.lazy(
  () => import("./routes/topratedmovies/topratedmovies.component")
);
const SearchComponent = React.lazy(
  () => import("./components/Search/search.component")
);
const Watchlist = React.lazy(
  () => import("./routes/watchlist/wacthlist.component")
);

const App = () => {
  const { setUser } = useUserStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((user: User | null) => {
      console.log(user);
      if (user) {
        createUserDocumentFromAuth(user);
      }
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return (
    <Suspense
      fallback={
        <div className="absolute inset-0 flex justify-center items-center">
          <span className="loading loading-ring loading-lg"></span>
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="popularmovies" element={<PopularMoviesComponent />} />
          <Route path="topratedmovies" element={<TopratedMoviesComponent />} />
          <Route path="search" element={<SearchComponent />} />
          <Route path="watchlist" element={<Watchlist />} />
          <Route
            path="popularmovies/:movieId"
            element={<MovieDetailsComponent />}
          />
          <Route
            path="topratedmovies/:movieId"
            element={<MovieDetailsComponent />}
          />
          <Route path="movie/:movieId" element={<MovieDetailsComponent />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;

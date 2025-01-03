// src/App.tsx
import { Routes, Route } from "react-router-dom";
import Navigation from "./routes/Navigation/navigation.component";
import Home from "./routes/Home/home.component";
import Signin from "./routes/Signin/signin.component";
import Signup from "./routes/Signup/signup.compomnent";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
} from "./utils/firebase/firebase.utils";
import { useEffect } from "react";
import { User } from "firebase/auth";
import useUserStore from "./store/userstore";
import PopularMoviesComponent from "./routes/popularmvoies/popularmovies";
import MovieDetailsComponent from "./components/MovieDetails/movie.component";
import TopratedMoviesComponent from "./routes/topratedmovies/topratedmovies.component";
import SearchComponent from "./components/Search/search.component";
import Watchlist from "./routes/watchlist/wacthlist.component";

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
  );
};

export default App;

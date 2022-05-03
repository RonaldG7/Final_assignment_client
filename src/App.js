import {useState, useEffect} from "react";
import './App.css';
import "normalize.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import mainContext from "./context/mainContext";
import http from "./plugins/http";
import IndexPage from "./pages/IndexPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProtectedRoutes from "./components/protectedRoutes/ProtectedRoutes";
import MyAccountPage from "./pages/MyAccountPage";
import RulesPage from "./pages/RulesPage";
import FavoritesPage from "./pages/FavoritesPage";
import TopicPage from "./pages/TopicPage";
import Toolbar from "./components/Toolbar/Toolbar";
import PostTopicPage from "./pages/PostTopicPage";
import AccountsPage from "./pages/AccountsPage";

function App() {

    const [user, setUser] = useState(null)
    const [topics, setTopics] = useState([])
    const [getFavorites, setFavorites] = useState([])
    const [getFavoritesIds, setFavoritesIds] = useState([])

    useEffect(() => {
        if (localStorage.getItem("stayLoggedIn") === "true") {
            http.get("/loggedIn").then(res => {
                if (res.success) setUser(res.user)
            })
        }
        const value = JSON.parse(localStorage.getItem('favorites'))
        if (value) {
            setFavoritesIds(JSON.parse(localStorage.getItem('favorites')))
        } else {
            localStorage.setItem('favorites', JSON.stringify([]));
            setFavoritesIds([])
        }
    }, [])


    return (
        <mainContext.Provider value={{
            user,
            setUser,
            topics,
            setTopics,
            getFavorites,
            setFavorites,
            getFavoritesIds,
            setFavoritesIds
        }}>
            <BrowserRouter>
                <Toolbar/>
                <Routes>
                    <Route path="/" element={<IndexPage/>}/>
                    <Route path="/register" element={<RegisterPage/>}/>
                    <Route path="/login" element={<LoginPage/>}/>
                    <Route path="/rules" element={<RulesPage/>}/>
                    <Route element={<ProtectedRoutes/>}>
                        <Route path="/account" element={<MyAccountPage/>}/>
                        <Route path="/postTopic" element={<PostTopicPage/>}/>
                    </Route>
                    <Route path="/favourites" element={<FavoritesPage/>}/>
                    <Route path="/topic/:_id" element={<TopicPage/>}/>
                    <Route path="/accounts/:username" element={<AccountsPage/>}/>
                </Routes>
            </BrowserRouter>
        </mainContext.Provider>
    );
}

export default App;

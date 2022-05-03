import {useContext, useEffect} from 'react';
import "./style.css"
import mainContext from "../../context/mainContext";
import http from "../../plugins/http";
import SingleTopic from "../singleTopic/SingleTopic";

const FavoritesComp = () => {

    const {getFavorites, setFavorites, getFavoritesIds} = useContext(mainContext)

    useEffect(() => {
        (async function () {
            const values = await JSON.parse(localStorage.getItem('favorites'))
            const data = {
                favorites: values
            }
            const favoriteTopics = await http.post('/getFavorites', data)
            if (favoriteTopics.success) {
                setFavorites(favoriteTopics.topics)
            }
        })()
    }, [getFavoritesIds])

    return (
        <div className="app p-5 padding-sm">
            <div className="favoritesHeader p-2">
                Favourites
            </div>
            <div className="favoritesBody">
                {getFavorites.length > 0 ? getFavorites.map((x, i) => <SingleTopic key={i} topic={x}/>)
                    :
                    <h5 className="d-flex justify-content-center p-5">No Favorites</h5>}
            </div>
        </div>
    );
};

export default FavoritesComp;
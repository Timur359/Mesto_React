import React from 'react';
import Footer from './Footer';
import Header from './Header';
import ImagePopup from './ImagePopup';
import Main from './Main';
import { api } from '../utils/api';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddPlacePopup from './AddPlacePopup';

function App() {
 const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
  React.useState(false);
 const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
 const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
  React.useState(false);

 const [isImagePopup, setIsImagePopup] = React.useState(false);
 const [selectedCard, setSelectedCard] = React.useState({});

 const handleCardClick = ({ name, link }) => {
  setIsImagePopup(!isImagePopup);
  setSelectedCard({ name, link });
 };

 const onAddPlace = () => {
  setIsAddPlacePopupOpen(!isAddPlacePopupOpen);
 };

 const onEditProfile = () => {
  setIsEditProfilePopupOpen(!isEditProfilePopupOpen);
 };

 const onEditAvatar = () => {
  setIsEditAvatarPopupOpen(!isEditAvatarPopupOpen);
 };

 const closeAllPopups = () => {
  setIsAddPlacePopupOpen(false);
  setIsEditProfilePopupOpen(false);
  setIsEditAvatarPopupOpen(false);
  setIsImagePopup(false);
 };

 const [currentUser, setCurrentUser] = React.useState({});
 const [cards, setCards] = React.useState([]);

 React.useEffect(() => {
  Promise.all([api.getUserData(), api.getInitialCards()])
   .then(([data, card]) => {
    setCurrentUser(data);
    setCards(card);
   })
   .catch((err) => console.log(err));
 }, []);

 const handleUpdateUser = (name) => {
  api.saveUserChanges(name).then((res) => {
   setCurrentUser(res);
   closeAllPopups();
  });
 };

 const handleUpdateAvatar = (res) => {
  api.changedAvatar(res).then((data) => {
   setCurrentUser(data);
   closeAllPopups();
  });
 };

 const handleAddPlaceSubmit = (data) => {
  api.postNewCard(data).then((res) => {
   setCards([res, ...cards]);
   closeAllPopups();
  });
 };

 const handleCardLike = (card) => {
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  api.likedCard(card._id, !isLiked).then((newCard) => {
   setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
  });
 };

 const handleCardDelete = (card) => {
  api.deleteCard(card._id).then(() => {
   const newCardList = cards.filter((c) => c !== card);
   setCards(newCardList);
  });
 };

 return (
  <CurrentUserContext.Provider value={currentUser}>
   <div className="page">
    <Header />
    <Main
     cards={cards}
     onAddPlace={onAddPlace}
     onEditProfile={onEditProfile}
     onEditAvatar={onEditAvatar}
     handleCardClick={handleCardClick}
     handleSubmitUser={handleUpdateUser}
     handleCardLike={handleCardLike}
     handleCardDelete={handleCardDelete}
    />
    <Footer />
    <ImagePopup
     isOpen={isImagePopup}
     onClose={closeAllPopups}
     name={selectedCard.name}
     link={selectedCard.link}
    />
    <EditProfilePopup
     isOpen={isEditProfilePopupOpen}
     onClose={closeAllPopups}
     handleSubmitUser={handleUpdateUser}
    />
    <EditAvatarPopup
     isOpen={isEditAvatarPopupOpen}
     onClose={closeAllPopups}
     onUpdateAvatar={handleUpdateAvatar}
    />
    <AddPlacePopup
     isOpen={isAddPlacePopupOpen}
     onClose={closeAllPopups}
     onAddPlace={handleAddPlaceSubmit}
    />
   </div>
  </CurrentUserContext.Provider>
 );
}

export default App;

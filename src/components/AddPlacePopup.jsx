import React from 'react';
import PopupWithForms from './PopupWithForms';

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
 const name = React.useRef({});
 const link = React.useRef({});

 function handleSubmit(e) {
  e.preventDefault();
  onAddPlace({
   name: name.current.value,
   link: link.current.value,
  });
 }

 React.useEffect(() => {
  name.current.value = '';
  link.current.value = '';
 }, [isOpen]);

 return (
  <PopupWithForms
   name={'add'}
   title={'Новое место'}
   isOpen={isOpen}
   onClose={onClose}
   onSubmit={handleSubmit}
   nameButton={'Добавить'}
  >
   <input
    name="name"
    id="nameImage"
    type="text"
    className="popup__input popup__input_place_name"
    placeholder="Название"
    minLength="2"
    maxLength="30"
    ref={name}
    required
   />
   <span className="popup__input-error" id="nameImage-error"></span>
   <input
    name="link"
    id="urlImage"
    type="url"
    className="popup__input popup__input_place_url"
    placeholder="Ссылка на картинку"
    ref={link}
    required
   />
   <span className="popup__input-error" id="urlImage-error"></span>
  </PopupWithForms>
 );
}

export default AddPlacePopup;

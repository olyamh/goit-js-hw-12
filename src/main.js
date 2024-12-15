import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
// import SimpleLightbox from 'simplelightbox';
// import 'simplelightbox/dist/css/simple-lightbox.min.css';

import { createMarkup } from './js/render-functions';
import { needPhotos } from './js/pixabay-api';


const API_KEY = '47534106-2225be5d16534437522f359a0';
const params = new URLSearchParams({
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
  per_page: 15,
});
const BASE_URL = 'https://pixabay.com/api/';

const gallery = document.querySelector(".gallery");
const form = document.querySelector('.js-search-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  gallery.innerHTML = '';

  const input = event.target.querySelector('.search-input');
  const clientInput = input.value.trim();
  console.log('input-trim:', clientInput);
  if (!clientInput) {
    iziToast.show({
      messageColor: 'white',
      backgroundColor: 'red',
      position: 'topRight',
      close: true,
      title: ``,
      message: 'Please, enter text',
    });
    form.reset();
    return;
  }
  params.set('q', clientInput);

  needPhotos(BASE_URL, API_KEY, params)
    .then(data => {
      if (data.hits.lenght === 0) {
        iziToast.show({
          messageColor: 'white',
          backgroundColor: 'red',
          position: 'topRight',
          close: true,
          title: '',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      }
      
      
      gallery.insertAdjacentHTML("beforeend" ,createMarkup(data.hits));
      const lightbox = new SimpleLightbox('.gallery-item a', {
        captionDelay: 250,
        captions: true,
        captionsData: 'alt',
      });

      lightbox.refresh();

      loader.style.visibility = 'hidden';
    })
    .catch(error =>
      iziToast.show({
        messageColor: 'white',
        backgroundColor: 'red',
        position: 'topRight',
        close: true,
        title: `${error}`,
        message:
          'Sorry, there are no images matching your search query. Please try again!',
      })
    )
    .finally(() => form.reset());


});
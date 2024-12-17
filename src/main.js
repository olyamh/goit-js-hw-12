import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

import { createMarkup } from './js/render-functions';
import { needPhotos } from './js/pixabay-api';


const lightbox = new SimpleLightbox('.gallery-item a', {
  captionDelay: 250,
  captions: true,
  captionsData: 'alt',
});

let pageValue="";
const API_KEY = '47534106-2225be5d16534437522f359a0';
const params = new URLSearchParams({
  key: API_KEY,
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  page: 1,
 per_page: 15
});
const BASE_URL = 'https://pixabay.com/api/';



let loadMore = document.querySelector('.js-load-more');
loadMore.classList.replace("load-more", "load-more-hidden");
const loader = document.querySelector('.loader');
loader.style.visibility = 'hidden';
const gallery = document.querySelector(".gallery");
const form = document.querySelector('.js-search-form');
form.addEventListener('submit', function (event) {
  event.preventDefault();
  gallery.innerHTML = '';
  loader.style.visibility = 'visible';
  loadMore.classList.replace("load-more", "load-more-hidden");
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
    loader.style.visibility = 'hidden';
    form.reset();
    return;
  }
  params.set('q', clientInput);
  params.set('page', 1);
  pageValue=1;

  needPhotos(BASE_URL, API_KEY, params)
    .then(data => {

     
        if (data.hits.length === 0) {
        iziToast.show({
          messageColor: 'white',
          backgroundColor: 'red',
          position: 'topRight',
          close: true,
          title: '',
          message:
            'Sorry, there are no images matching your search query. Please try again!',
        });
      } else if (data.hits.length === data.total ){
        gallery.insertAdjacentHTML("beforeend",createMarkup(data.hits));
        
      }  else if(data.hits.length < data.total ) {
      gallery.insertAdjacentHTML("beforeend", createMarkup(data.hits));
      loadMore.classList.replace("load-more-hidden", "load-more");
      }
            
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
      }),
      loader.style.visibility = 'hidden'
    )
    .finally(() => form.reset());

    
});

loadMore.addEventListener('click', function () {
  loader.style.visibility = 'visible'; 
  loadMore.disable = true;
  pageValue ++;
  params.set('page', pageValue);  
  
  needPhotos(BASE_URL, API_KEY, params)
   .then (data => {
  const endOfPhotots = Math.ceil(data.totalHits /pageValue);
  
  gallery.insertAdjacentHTML("beforeend" ,createMarkup(data.hits));
  lightbox.refresh();
  const imageCard = document.querySelector(".gallery-item");
  const imageCardHeight = imageCard.getBoundingClientRect().height;
  
  console.log(imageCardHeight);
  window.scrollBy({
    left: 0,
    top: 400,
    behavior: "smooth"
  })

  if (endOfPhotots <= 15){
    loadMore.classList.replace("load-more", "load-more-hidden");
    iziToast.show({
      messageColor: 'white',
      backgroundColor: 'red',
      position: 'bottomCenter',
      close: true,
      title: ``,
      message:
        "We're sorry, but you've reached the end of search results.",
    }),
    gallery.insertAdjacentHTML('beforeend', `<p>We're sorry, but you've reached the end of search results.</p>
      `)
    loader.style.visibility = 'hidden';
   
  }
  
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
  }),
  loader.style.visibility = 'hidden'
)
.finally(() => loadMore.disable = false);
})
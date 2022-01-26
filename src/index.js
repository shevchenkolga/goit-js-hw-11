import './css/styles.css';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import PixabayService from './js/fetchPixabay';

const FormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreBtnEl = document.querySelector('.load-more');

const pixabayService = new PixabayService();
const simplelightbox = new simpleLightbox('.gallery a', {
    captionDelay: 250,
});

FormEl.addEventListener("submit", onSearch);
loadMoreBtnEl.addEventListener("click", onLoadmore);

function onSearch(e) {
    e.preventDefault();
    pixabayService.query = e.currentTarget.elements.searchQuery.value.trim();
    loadMoreBtnEl.classList.add(".is-hidden");
    pixabayService.resetPage();
     galleryEl.innerHTML = '';

    if (pixabayService.query) {
        pixabayService.fetchImages()
            .then(data => {                
                if (data.hits.length < 40) {
                    Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
                    loadMoreBtnEl.classList.add('is-hidden');
                    appendImagesMarkup(data);
                    return;
                }
                loadMoreBtnEl.classList.remove('is-hidden');
                appendImagesMarkup(data);
            })
    }
}

function onLoadmore() {
     pixabayService.fetchImages().then(data => {
        if (data.hits.length < 40) {             
            Notiflix.Notify.failure('We are sorry, but you have reached the end of search results.');
            loadMoreBtnEl.classList.add('is-hidden');
            appendImagesMarkup(data);
            return;
        };
        appendImagesMarkup(data);
        
    });
}
function appendImagesMarkup(data) {
    
    const images =  data.hits.map(item => `
 <a class="photo-card"href="${item.largeImageURL}">
    <div >
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
    <div class="info">
        <p class="info-item">
        <b>Likes</b> <span>${item.likes}</span>
        </p>
        <p class="info-item">
        <b>Views</b><span>${item.views}</span>
        </p>
        <p class="info-item">
        <b>Comments</b><span>${item.comments}</span>
        </p>
        <p class="info-item">
        <b>Downloads</b><span>${item.downloads}</span>
        </p>
    </div>
    </div>
    </a>
`).join(" ");
    galleryEl.insertAdjacentHTML("beforeend", images);
    simpleLightbox.refresh();
}

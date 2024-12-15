export function createMarkup(images){
    return images.map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) =>`
                <li class="gallery-item">
                    <a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" width="360"/>
                        <ul class="image-descr-list">
                            <li class="image-descr-item">Tags: ${tags}</li>
                            <li class="image-descr-item">Likes: ${likes}</li>
                            <li class="image-descr-item">Views: ${views}</li>
                            <li class="image-descr-item">Comments: ${comments}</li>
                            <li class="image-descr-item">Downloads: ${downloads}</li>
                        </ul>
                    </a>
                </li>
                `
            ).join('');
}

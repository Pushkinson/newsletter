export default class News {
    constructor(news, removeNewsElement) {
        this.news = news;
        this.id = news.id;
        this.removeNewsElement = removeNewsElement;
        this.render();
        this.createNewsMessage(this.news);
        this.bindHandlers();
    }

    render() {
        const newsMainElement = document.createElement('div');
        newsMainElement.classList.add('news');
        newsMainElement.id = `news-${this.id}`;
        newsMainElement.innerHTML = `
            <div class="news__container">
            </div>
        `;

        this.elem = newsMainElement;
    }

    createNewsMessage(news) {
        const newsElement = this.elem.querySelector('.news__container');
        newsElement.innerHTML = '';
        const newsElementText = `
            <div class="news__inner">
                <div class="news__img" style="background-image: url(./assets/img/${news.img}.jpg)"></div>
                <div class="news__content">
                    <div class="news__header">${news.header}</div>
                    <div class="news__author">${news.author}</div>
                    <div class="news__date">${news.date}</div>
                    <div class="news__details"><a href="#" title="details">${news.details}</a></div>
                    <div class="news__status">${news.status}</div>
                </div>
                <div class="news__close"></div>
            </div>
        `;
        newsElement.insertAdjacentHTML('beforeend', newsElementText);
        return newsElement;
    }

    bindHandlers() {
        this.elem.querySelector('.news__status').addEventListener('click', this.changeStatus.bind(this));
        this.elem.querySelectorAll('.news__close').forEach((item) => {
            item.addEventListener('click', this.clickOnClose.bind(this))
        });
    }

    changeStatus(e) {
        if (e.target == this.elem.querySelector('.news__status')) {
            e.stopPropagation();
            e.path[2].classList.add('viewed');
            e.target.classList.add('hidden');
        }
    }

    /**
     * Таймаут установлен для корректного отображения анимации удаленной новости
     */
    clickOnClose(e) {
        e.stopPropagation();
        this.elem.classList.add('animated');
        setTimeout(() => this.removeNewsElement(`news-${this.id}`), 1500);
    }
}
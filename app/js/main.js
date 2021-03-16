import News from './news.js';

export default class Main{
    constructor() {
        this.body = document.querySelector('body');
        this.newsCount = 3; // Количество отображаемых новостей

        this.render();
    }

    async render() {
        this.elem = this.getMainContainer();

        try {
            const response = await fetch('./news.json');
            this.newsObjects = await response.json();

            this.newsHolder = this.elem.querySelector('.main__container');
            this.newsHolder.innerHTML = '';

            let index = 0;
            while (index < this.newsCount) {
                let newsElement = new News(this.newsObjects[index], this.removeNewsElement.bind(this)); // Передаю ссылку на фукцию вместе с контекстом для использования в классе News
                this.newsHolder.insertAdjacentElement('beforeend', newsElement.elem);
                index++;
            }

            this.unreadNews = this.newsObjects.slice(index); // Отслеживаю количество оставшихся объектов
            this.body.append(this.elem);
            this.elem.querySelector('.main__number-news').textContent = this.newsObjects.length; // Счетчик новостей
            this.bindHandlers();
            return response;
        } catch(error) {
            console.error(error);
        }
    }

    getMainContainer() {
        const newMainElement = document.createElement('div');
        newMainElement.classList.add('main');
        newMainElement.id = 'main';
        newMainElement.innerHTML = `
            <div class=main__number-news></div>
            <div class="main__container">
                </div>
        `;
        return newMainElement;
    }

    removeNewsElement(id) {
        document.querySelector(`#${id}`).remove(); // id - поле объекта News для удаления выбранных новостей
        this.newsObjects = this.newsObjects.slice(1);
        this.elem.querySelector('.main__number-news').textContent = this.newsObjects.length;
        if (this.unreadNews.length) { // Если новости остались, добавляю
            this.addNewsElement();
        }
    }

    addNewsElement() {
        let newsElement = new News(this.unreadNews[0], this.removeNewsElement.bind(this));
        this.newsHolder.insertAdjacentElement('beforeend', newsElement.elem);
        this.unreadNews = this.unreadNews.slice(1);
    }

    bindHandlers() {
        this.elem.addEventListener('click', this.openNews.bind(this));
    }

    openNews(e) {
        const newsTape = this.elem.querySelector('.main__container');
        const mainNumbers = this.elem.querySelector('.main__number-news');
        if( e.target === mainNumbers) {
            newsTape.classList.toggle('showed');
        }
    }
}
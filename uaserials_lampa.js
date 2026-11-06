
(function () {
    'use strict';

    if (window.uakino_plugin_loaded) return;
    window.uakino_plugin_loaded = true;

    var SITE = 'https://uakino.best';

    function notify(message) {
        if (window.Lampa && Lampa.Noty) {
            Lampa.Noty.show(message);
        }
    }

    function searchMovie(movie) {
        var title = movie.title || movie.name ||
                    movie.original_title ||
                    movie.original_name;

        if (!title) {
            notify('UAKino: назву не знайдено');
            return;
        }

        notify('UAKino: шукаємо ' + title);

        var url = SITE +
            '/index.php?do=search&subaction=search&story=' +
            encodeURIComponent(title);

        if (!Lampa.Network ||
            typeof Lampa.Network.native !== 'function') {
            notify('UAKino: мережевий API недоступний');
            return;
        }

        try {
            Lampa.Network.native(
                url,
                function (html) {
                    if (typeof html !== 'string') {
                        notify('UAKino: невідома відповідь');
                        return;
                    }

                    console.log(
                        '[UAKino] Search response:',
                        html.substring(0, 1000)
                    );

                    notify(
                        'UAKino: відповідь отримано (' +
                        html.length + ' символів)'
                    );
                },
                function (error) {
                    console.error('[UAKino]', error);
                    notify('UAKino: помилка запиту');
                }
            );
        } catch (error) {
            console.error('[UAKino]', error);
            notify('UAKino: помилка API');
        }
    }

    function addButton(event) {
        if (!event || event.type !== 'complite') return;

        var movie = event.data &&
                    (event.data.movie || event.data);

        if (!movie || !event.object ||
            !event.object.container) return;

        var container = event.object.container;
        var buttons = container.find(
            '.full-start__buttons'
        );

        if (!buttons.length ||
            buttons.find('.uakino-button').length) return;

        var button = $(
            '<div class="full-start__button selector uakino-button">' +
            '<span>UAKino</span>' +
            '</div>'
        );

        button.on('hover:enter click', function () {
            searchMovie(movie);
        });

        buttons.append(button);
    }

    function start() {
        if (!window.Lampa || !Lampa.Listener) return;

        Lampa.Listener.follow('full', addButton);
        notify('UAKino v1.1 завантажено');
    }

    if (window.appready) {
        start();
    } else if (window.Lampa && Lampa.Listener) {
        Lampa.Listener.follow('app', function (event) {
            if (event.type === 'ready') start();
        });
    }
})();

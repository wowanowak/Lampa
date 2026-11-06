
(function () {
  'use strict';

  if (window.__uakino_v2) return;
  window.__uakino_v2 = true;

  var HOST = 'https://uakino.best';

  function notify(message) {
    if (Lampa.Noty && Lampa.Noty.show) {
      Lampa.Noty.show(message);
    }
  }

  function titleOf(movie) {
    return movie.title || movie.name ||
      movie.original_title ||
      movie.original_name || '';
  }

  function search(movie) {
    var title = titleOf(movie);
    if (!title) {
      notify('UAKino: назву не знайдено');
      return;
    }

    var url = HOST +
      '/index.php?do=search&subaction=search&story=' +
      encodeURIComponent(title);

    notify('UAKino: пошук ' + title);

    var request = new Lampa.Reguest();

    request.silent(
      url,
      function (html) {
        if (typeof html !== 'string') {
          notify('UAKino: неправильна відповідь');
          return;
        }

        var doc = new DOMParser().parseFromString(
          html, 'text/html'
        );

        var links = [];
        var elements = doc.querySelectorAll('a[href]');

        for (var i = 0; i < elements.length; i++) {
          var a = elements[i];
          var href = a.getAttribute('href') || '';
          var name = (a.textContent || '').trim();

          if (!name || !href) continue;

          try {
            var absolute = new URL(href, HOST);
            if (absolute.hostname !== 'uakino.best') continue;
            if (!/\.html(?:$|\?)/.test(absolute.href)) continue;

            if (!links.some(function (x) {
              return x.url === absolute.href;
            })) {
              links.push({
                title: name.substring(0, 120),
                url: absolute.href
              });
            }
          } catch (e) {}
        }

        if (!links.length) {
          notify('UAKino: результатів не знайдено');
          return;
        }

        var items = links.slice(0, 30).map(function (x) {
          return {
            title: x.title,
            url: x.url
          };
        });

        Lampa.Select.show({
          title: 'UAKino — результати пошуку',
          items: items,
          onSelect: function (item) {
            console.log('[UAKino] Selected:', item.url);
            notify('UAKino: ' + item.title);
            // Відеопотік поки не підключено.
          },
          onBack: function () {
            Lampa.Controller.toggle('content');
          }
        });
      },
      function (error) {
        console.error('[UAKino]', error);
        notify('UAKino: помилка запиту');
      },
      false,
      { dataType: 'text' }
    );
  }

  function addButton(event) {
    if (!event || event.type !== 'complite') return;

    var data = event.data || {};
    var movie = data.movie || data;
    var container = event.object &&
      event.object.container;

    if (!container || !window.$) return;

    var buttons = container.find('.full-start__buttons');
    if (!buttons.length ||
        buttons.find('.uakino-v2-button').length) return;

    var button = $(
      '<div class="full-start__button selector uakino-v2-button">' +
      '<span>UAKino</span></div>'
    );

    button.on('hover:enter', function () {
      search(movie);
    });

    buttons.append(button);
  }

  function start() {
    if (!window.Lampa || !Lampa.Listener ||
        !Lampa.Reguest || !Lampa.Select) {
      return;
    }

    Lampa.Listener.follow('full', addButton);
    notify('UAKino v2.0 завантажено');
  }

  if (window.appready) {
    start();
  } else if (window.Lampa && Lampa.Listener) {
    Lampa.Listener.follow('app', function (event) {
      if (event.type === 'ready') start();
    });
  }
})();

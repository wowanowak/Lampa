
(function () {
  'use strict';

  if (window.__uaserials_v02_loaded) return;
  window.__uaserials_v02_loaded = true;

  var started = false;

  function notice(msg) {
    try {
      if (window.Lampa && Lampa.Noty && Lampa.Noty.show) {
        Lampa.Noty.show(msg);
      }
    } catch (err) {
      console.log('[UASerials]', err);
    }
    console.log('[UASerials]', msg);
  }

  function addButton(e) {
    if (!e || e.type !== 'complite' ||
        !e.object || !e.object.activity ||
        !e.object.activity.render) return;

    try {
      var root = e.object.activity.render();
      if (!root || !root.find || !window.$) return;
      if (root.find('.uaserials-test-button').length) return;

      var buttons = root.find(
        '.full-start-new__buttons, .full-start__buttons'
      ).first();

      if (!buttons.length) {
        buttons = root.find('.view--torrent').parent();
      }
      if (!buttons.length) return;

      var movie = (e.data && (e.data.movie || e.data)) || {};
      var title = movie.title || movie.name ||
        movie.original_title || movie.original_name || 'Фільм';

      var button = $(
        '<div class="full-start__button selector uaserials-test-button" ' +
        'data-subtitle="UASerials Test">' +
        '<svg viewBox="0 0 24 24" width="24" height="24">' +
        '<path fill="currentColor" d="M8 5v14l11-7z"/>' +
        '</svg><span>UASerials</span></div>'
      );

      button.on('hover:enter click', function () {
        notice('UASerials v0.2: ' + title + ' — кнопка працює');
      });

      buttons.append(button);
    } catch (err) {
      console.log('[UASerials] Button error:', err);
    }
  }

  function start() {
    if (started || !window.Lampa ||
        !Lampa.Listener || !Lampa.Listener.follow) return;

    started = true;
    Lampa.Listener.follow('full', addButton);
    notice('UASerials Test v0.2 завантажено');
  }

  function bootstrap() {
    if (!window.Lampa || !Lampa.Listener ||
        !Lampa.Listener.follow) {
      return setTimeout(bootstrap, 300);
    }

    if (window.appready) return start();

    Lampa.Listener.follow('app', function (e) {
      if (e && e.type === 'ready') start();
    });

    setTimeout(function () {
      if (!started) start();
    }, 1500);
  }

  bootstrap();
})();

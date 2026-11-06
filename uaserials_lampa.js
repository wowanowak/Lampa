
/* UASerials for Lampa — integration test v0.1
 * This plugin does NOT extract or play videos from uaserials.my.
 * It adds a button to film/series details and displays the selected title.
 */
(function () {
  'use strict';
  if (window.__uaserials_lampa_test_loaded) return;
  window.__uaserials_lampa_test_loaded = true;

  function notify(message) {
    if (window.Lampa && Lampa.Noty && typeof Lampa.Noty.show === 'function') {
      Lampa.Noty.show(message);
    } else {
      console.log('[UASerials]', message);
    }
  }

  function getTitle(data) {
    var item = (data && (data.movie || data.data || data.object)) || {};
    return item.title || item.name || item.original_title || item.original_name || 'Невідома назва';
  }

  function addButton(event) {
    if (!event || event.type !== 'complite') return;
    var activity = event.object;
    if (!activity || !activity.activity || !activity.activity.render) return;
    var root = activity.activity.render();
    if (!root || !window.$) return;
    var buttons = root.find('.full-start__buttons');
    if (!buttons.length || buttons.find('.uaserials-online-test').length) return;

    var button = $('<div class="full-start__button selector uaserials-online-test" data-subtitle="UASerials"><span>UASerials</span></div>');
    button.on('hover:enter click', function () {
      notify('UASerials: ' + getTitle(event.data || activity) + '. Тест інтеграції успішний. Відеоджерело ще не підключене.');
    });
    buttons.append(button);
  }

  function start() {
    if (!window.Lampa || !Lampa.Listener || !Lampa.Listener.follow) return;
    Lampa.Listener.follow('full', addButton);
    notify('UASerials Test v0.1 завантажено');
  }

  if (window.appready) start();
  else if (window.Lampa && Lampa.Listener) {
    Lampa.Listener.follow('app', function (event) {
      if (event.type === 'ready') start();
    });
  } else {
    console.warn('[UASerials] Lampa API is not available');
  }
})();

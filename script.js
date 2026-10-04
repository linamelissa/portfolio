if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', function () {
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  }
});

/* ================= Videos: Autoplay auch auf dem Handy =================
   Die Seite wird erst im Browser aufgebaut (<x-dc>). Darum wird nicht nur
   einmal beim Laden gesucht, sondern jedes Video, das später erscheint,
   automatisch vorbereitet und gestartet. */
(function () {
  var io = null;

  function isVisible(v) {
    var r = v.getBoundingClientRect();
    return r.bottom > 0 && r.top < window.innerHeight && r.width > 0;
  }

  function tryPlay(v) {
    if (!v.paused) return;
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  function prepare(v) {
    if (v.__lmReady) return;
    v.__lmReady = true;
    // iOS startet nur stumme Inline-Videos von selbst – als Eigenschaft UND Attribut setzen
    v.muted = true;
    v.defaultMuted = true;
    v.loop = true;
    v.playsInline = true;
    v.autoplay = true;
    v.setAttribute('muted', '');
    v.setAttribute('playsinline', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('autoplay', '');
    v.setAttribute('loop', '');
    if (!v.getAttribute('preload')) v.setAttribute('preload', 'auto');

    v.addEventListener('loadeddata', function () { if (isVisible(v)) tryPlay(v); });
    v.addEventListener('canplay', function () { if (isVisible(v)) tryPlay(v); });

    if (io) io.observe(v);
    if (isVisible(v)) tryPlay(v);
  }

  function scan() {
    var list = document.querySelectorAll('video');
    for (var i = 0; i < list.length; i++) prepare(list[i]);
  }

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var v = entry.target;
        if (entry.isIntersecting) tryPlay(v);
        else if (!v.paused) v.pause();
      });
    }, { threshold: 0.1 });
  }

  // Neue Videos erkennen, sobald das Framework sie einsetzt
  var queued = false;
  function queueScan() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; scan(); });
  }
  if ('MutationObserver' in window) {
    new MutationObserver(queueScan).observe(document.documentElement, { childList: true, subtree: true });
  }

  function resumeVideos() {
    if (document.visibilityState === 'hidden') return;
    var list = document.querySelectorAll('video');
    for (var i = 0; i < list.length; i++) {
      if (isVisible(list[i])) tryPlay(list[i]);
    }
  }

  scan();
  document.addEventListener('DOMContentLoaded', scan);
  window.addEventListener('load', scan);
  document.addEventListener('visibilitychange', resumeVideos);
  window.addEventListener('pageshow', resumeVideos);
  window.addEventListener('focus', resumeVideos);

  // Stromsparmodus (iPhone) blockiert Autoplay: beim ersten Antippen/Scrollen starten
  document.addEventListener('touchstart', resumeVideos, { passive: true });
  document.addEventListener('click', resumeVideos, true);
  var scrollTick = false;
  window.addEventListener('scroll', function () {
    if (scrollTick) return;
    scrollTick = true;
    requestAnimationFrame(function () { scrollTick = false; resumeVideos(); });
  }, { passive: true });
})();

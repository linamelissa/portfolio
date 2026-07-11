document.addEventListener('DOMContentLoaded', function () {
  var cvButton = document.querySelector('.btn-primary');
  if (cvButton) {
    cvButton.addEventListener('click', function () {
      // Später: Link zur echten CV-PDF einsetzen
      window.open('assets/lina-melissa-cv.pdf', '_blank');
    });
  }

  var aboutButton = document.querySelector('.btn-secondary');
  if (aboutButton) {
    aboutButton.addEventListener('click', function () {
      var aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});

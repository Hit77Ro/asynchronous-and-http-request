export default class LazyLoader {
  constructor(options) {
    this.options = options || {
      threshold: 0,
      rootMargin: "0px",
      root: null,
    };
    this._imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // If the image is intersecting (visible in the viewport), load it
          this._lazyLoadImage(entry.target);
          this._imageObserver.unobserve(entry.target); // Unobserve the image after loading to avoid redundant operations
        }
      });
    }, this.options);
  }

  _lazyLoadImage(image) {
    image.src = image.dataset.src;
    // Show the original image after it loads
    image.addEventListener("load", () =>
      image.complete ? image.closest(".img").classList.add("loaded") : null
    );
  }
  observe(element) {
    this._imageObserver.observe(element);
  }
}

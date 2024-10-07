function hideProductModal() {
  const productModal = document.querySelectorAll('product-modal[open]');
  productModal && productModal.forEach((modal) => modal.hide());
}

document.addEventListener('shopify:block:select', function (event) {
  hideProductModal();
  const blockSelectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockSelectedIsSlide) return;

  const parentSlideshowComponent = event.target.closest('slideshow-component');
  parentSlideshowComponent.pause();

  setTimeout(function () {
    parentSlideshowComponent.slider.scrollTo({
      left: event.target.offsetLeft,
    });
  }, 200);
});

document.addEventListener('shopify:block:deselect', function (event) {
  const blockDeselectedIsSlide = event.target.classList.contains('slideshow__slide');
  if (!blockDeselectedIsSlide) return;
  const parentSlideshowComponent = event.target.closest('slideshow-component');
  if (parentSlideshowComponent.autoplayButtonIsSetToPlay) parentSlideshowComponent.play();
});

document.addEventListener('shopify:section:load', () => {
  hideProductModal();
  const zoomOnHoverScript = document.querySelector('[id^=EnableZoomOnHover]');
  if (!zoomOnHoverScript) return;
  if (zoomOnHoverScript) {
    const newScriptTag = document.createElement('script');
    newScriptTag.src = zoomOnHoverScript.src;
    zoomOnHoverScript.parentNode.replaceChild(newScriptTag, zoomOnHoverScript);
  }
});

document.addEventListener('shopify:section:reorder', () => hideProductModal());

document.addEventListener('shopify:section:select', () => hideProductModal());

document.addEventListener('shopify:section:deselect', () => hideProductModal());

document.addEventListener('shopify:inspector:activate', () => hideProductModal());

document.addEventListener('shopify:inspector:deactivate', () => hideProductModal());

theme.Slideshow = (function () {
    this.$slideshow = null;
    var classes = {
        slideshow: 'slideshow',
        slickActiveMobile: 'slick-active-mobile',
        controlsHover: 'slideshow__controls--hover',
        isPaused: 'is-paused'
    };

    var selectors = {
        section: '.shopify-section',
        wrapper: '#SlideshowWrapper-',
        slides: '.slideshow__slide',
        textWrapperMobile: '.slideshow__text-wrap--mobile',
        textContentMobile: '.slideshow__text-content--mobile',
        controls: '.slideshow__controls',
        pauseButton: '.slideshow__pause',
        dots: '.slick-dots',
        arrows: '.slideshow__arrows',
        arrowsMobile: '.slideshow__arrows--mobile',
        arrowLeft: '.slideshow__arrow-left',
        arrowRight: '.slideshow__arrow-right'
    };

    function slideshow(el, sectionId) {
        var $slideshow = (this.$slideshow = $(el));
        this.adaptHeight = this.$slideshow.data('adapt-height');
        this.$wrapper = this.$slideshow.closest(selectors.wrapper + sectionId);
        this.$section = this.$wrapper.closest(selectors.section);
        this.$controls = this.$wrapper.find(selectors.controls);
        this.$arrows = this.$section.find(selectors.arrows);
        this.$arrowsMobile = this.$section.find(selectors.arrowsMobile);
        this.$pause = this.$controls.find(selectors.pauseButton);
        this.$textWrapperMobile = this.$section.find(selectors.textWrapperMobile);
        this.autorotate = this.$slideshow.data('autorotate');
        var autoplaySpeed = this.$slideshow.data('speed');
        var loadSlideA11yString = this.$slideshow.data('slide-nav-a11y');

        this.settings = {
            accessibility: true,
            arrows: false,
            dots: true,
            fade: true,
            draggable: true,
            touchThreshold: 20,
            autoplay: this.autorotate,
            autoplaySpeed: autoplaySpeed,
            // eslint-disable-next-line shopify/jquery-dollar-sign-reference
            appendDots: this.$arrows,
            customPaging: function (slick, index) {
                return (
                    '<a href="' +
                    selectors.wrapper +
                    sectionId +
                    '" aria-label="' +
                    loadSlideA11yString.replace('[slide_number]', index + 1) +
                    '" data-slide-number="' +
                    index +
                    '"></a>'
                );
            }
        };

        this.$slideshow.on('beforeChange', beforeChange.bind(this));
        this.$slideshow.on('init', slideshowA11ySetup.bind(this));

        // Add class to style mobile dots & show the correct text content for the
        // first slide on mobile when the slideshow initialises
        this.$slideshow.on(
            'init',
            function () {
                this.$mobileDots
                    .find('li:first-of-type')
                    .addClass(classes.slickActiveMobile);
                this.showMobileText(0);
            }.bind(this)
        );

        // Stop the autorotate when you scroll past the mobile controls, resume when
        // they are scrolled back into view
        if (this.autorotate) {
            $(document).scroll(
                $.debounce(
                    250,
                    function () {
                        if (
                            this.$arrowsMobile.offset().top +
                            this.$arrowsMobile.outerHeight() <
                            window.pageYOffset
                        ) {
                            $slideshow.slick('slickPause');
                        } else if (!this.$pause.hasClass(classes.isPaused)) {
                            $slideshow.slick('slickPlay');
                        }
                    }.bind(this)
                )
            );
        }

        if (this.adaptHeight) {
            this.setSlideshowHeight();
            $(window).resize($.debounce(50, this.setSlideshowHeight.bind(this)));
        }

        this.$slideshow.slick(this.settings);

        // This can't be called when the slick 'init' event fires due to how slick
        // adds a11y features.
        slideshowPostInitA11ySetup.bind(this)();

        this.$arrows.find(selectors.arrowLeft).on('click', function () {
            $slideshow.slick('slickPrev');
        });
        this.$arrows.find(selectors.arrowRight).on('click', function () {
            $slideshow.slick('slickNext');
        });

        this.$pause.on('click', this.togglePause.bind(this));
    }

    function slideshowA11ySetup(event, obj) {
        var $slider = obj.$slider;
        var $list = obj.$list;
        this.$dots = this.$section.find(selectors.dots);
        this.$mobileDots = this.$dots.eq(1);

        // Remove default Slick aria-live attr until slider is focused
        $list.removeAttr('aria-live');

        this.$wrapper.on('keyup', keyboardNavigation.bind(this));
        this.$controls.on('keyup', keyboardNavigation.bind(this));
        this.$textWrapperMobile.on('keyup', keyboardNavigation.bind(this));

        // When an element in the slider is focused
        // pause slideshow and set aria-live.
        this.$wrapper
            .on(
                'focusin',
                function (evt) {
                    if (!this.$wrapper.has(evt.target).length) {
                        return;
                    }

                    $list.attr('aria-live', 'polite');
                    if (this.autorotate) {
                        $slider.slick('slickPause');
                    }
                }.bind(this)
            )
            .on(
                'focusout',
                function (evt) {
                    if (!this.$wrapper.has(evt.target).length) {
                        return;
                    }

                    $list.removeAttr('aria-live');
                    if (this.autorotate) {
                        // Only resume playing if the user hasn't paused using the pause
                        // button
                        if (!this.$pause.is('.is-paused')) {
                            $slider.slick('slickPlay');
                        }
                    }
                }.bind(this)
            );

        // Add arrow key support when focused
        if (this.$dots) {
            this.$dots
                .find('a')
                .each(function () {
                    var $dot = $(this);
                    $dot.on('click keyup', function (evt) {
                        if (
                            evt.type === 'keyup' &&
                            evt.which !== slate.utils.keyboardKeys.ENTER
                        )
                            return;

                        evt.preventDefault();

                        var slideNumber = $(evt.target).data('slide-number');

                        $slider.attr('tabindex', -1).slick('slickGoTo', slideNumber);

                        if (evt.type === 'keyup') {
                            $slider.focus();
                        }
                    });
                })
                .eq(0)
                .attr('aria-current', 'true');
        }

        this.$controls
            .on('focusin', highlightControls.bind(this))
            .on('focusout', unhighlightControls.bind(this));
    }

    function slideshowPostInitA11ySetup() {
        var $slides = this.$slideshow.find(selectors.slides);

        $slides.removeAttr('role').removeAttr('aria-labelledby');
        this.$dots
            .removeAttr('role')
            .find('li')
            .removeAttr('role')
            .removeAttr('aria-selected')
            .each(function () {
                var $dot = $(this);
                var ariaControls = $dot.attr('aria-controls');
                $dot
                    .removeAttr('aria-controls')
                    .find('a')
                    .attr('aria-controls', ariaControls);
            });
    }

    function beforeChange(event, slick, currentSlide, nextSlide) {
        var $dotLinks = this.$dots.find('a');
        var $mobileDotLinks = this.$mobileDots.find('li');

        $dotLinks
            .removeAttr('aria-current')
            .eq(nextSlide)
            .attr('aria-current', 'true');

        $mobileDotLinks
            .removeClass(classes.slickActiveMobile)
            .eq(nextSlide)
            .addClass(classes.slickActiveMobile);
        this.showMobileText(nextSlide);
    }

    function keyboardNavigation() {
        if (event.keyCode === slate.utils.keyboardKeys.LEFTARROW) {
            this.$slideshow.slick('slickPrev');
        }
        if (event.keyCode === slate.utils.keyboardKeys.RIGHTARROW) {
            this.$slideshow.slick('slickNext');
        }
    }

    function highlightControls() {
        this.$controls.addClass(classes.controlsHover);
    }

    function unhighlightControls() {
        this.$controls.removeClass(classes.controlsHover);
    }

    slideshow.prototype.togglePause = function () {
        var slideshowSelector = getSlideshowId(this.$pause);
        if (this.$pause.hasClass(classes.isPaused)) {
            this.$pause.removeClass(classes.isPaused).attr('aria-pressed', 'false');
            if (this.autorotate) {
                $(slideshowSelector).slick('slickPlay');
            }
        } else {
            this.$pause.addClass(classes.isPaused).attr('aria-pressed', 'true');
            if (this.autorotate) {
                $(slideshowSelector).slick('slickPause');
            }
        }
    };

    slideshow.prototype.setSlideshowHeight = function () {
        var minAspectRatio = this.$slideshow.data('min-aspect-ratio');
        this.$slideshow.height($(document).width() / minAspectRatio);
    };

    slideshow.prototype.showMobileText = function (slideIndex) {
        var $allTextContent = this.$textWrapperMobile.find(
            selectors.textContentMobile
        );
        var currentTextContentSelector =
            selectors.textContentMobile + '-' + slideIndex;
        var $currentTextContent = this.$textWrapperMobile.find(
            currentTextContentSelector
        );
        if (
            !$currentTextContent.length &&
            this.$slideshow.find(selectors.slides).length === 1
        ) {
            this.$textWrapperMobile.hide();
        } else {
            this.$textWrapperMobile.show();
        }
        $allTextContent.hide();
        $currentTextContent.show();
    };

    function getSlideshowId($el) {
        return '#Slideshow-' + $el.data('id');
    }

    return slideshow;
})();


// // Ensure jQuery is loaded
// if (typeof jQuery !== 'undefined') {
//   console.log('jQuery is loaded');
// } else {
//   console.log('jQuery is not loaded');
// }

// // Initialize Slick Slider when the document is ready
// $(document).ready(function(){
//   // Initialize Slick Slider and log a message
//   $('.list').slick({
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: false,
//     autoplaySpeed: 2000,
//     arrows: true,
//     dots: true, // Ensure dots are enabled
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           infinite: true,
//           dots: true
//         }
//       },
//       {
//         breakpoint: 600,
//         settings: {
//           slidesToShow: 1,
//           slidesToScroll: 1,
//           dots: true
//         }
//       }
//     ]
//   });

//   console.log('Slick Slider initialized');
// });

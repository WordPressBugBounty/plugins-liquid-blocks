document.addEventListener('DOMContentLoaded', function () {
    const initializeSwipers = () => {
        document.querySelectorAll('.swiper').forEach(function(slider) {
            // slider要素が存在するかチェック
            if (!(slider instanceof Element)) {
                console.error("Swiper element not found or not an Element.");
                return;
            }

            const slidesPerView = slider.getAttribute('data-slides-per-view') || 1;
            const animationType = slider.getAttribute('data-animation-type') || 'slide';
            const delay = slider.getAttribute('data-delay') || 3000;
            const speed = slider.getAttribute('data-speed') || 300;
            const autoPlay = slider.getAttribute('data-autoplay') === 'true' ? { delay: parseInt(delay, 10) } : false;

            try {
                const swiper = new Swiper(slider, {
                    loop: true,
                    slidesPerView: parseFloat(slidesPerView),
                    centeredSlides: true,
                    spaceBetween: 0,
                    effect: animationType,
                    fadeEffect: {
                        crossFade: true
                    },
                    autoplay: autoPlay,
                    speed: speed,
                    keyboard: {
                        enabled: true,
                    },
                    pagination: {
                        el: slider.querySelector('.swiper-pagination'),
                        clickable: true
                    },
                    navigation: {
                        nextEl: slider.querySelector('.swiper-button-next'),
                        prevEl: slider.querySelector('.swiper-button-prev')
                    },
                });
            } catch (error) {
                console.error("Error initializing Swiper:", error);
            }
        });
    };

    // setTimeoutで100ms遅延
    setTimeout(initializeSwipers, 100);

    // または requestAnimationFrameを使ってスライダーを初期化
    // requestAnimationFrame(initializeSwipers);

    // タブブロック
    var tabBlocks = document.querySelectorAll(".liquid-tabs");
    tabBlocks.forEach(function(tabBlock) {
        var tabNav = tabBlock.querySelector(".liquid-tabs-navigation");
        var tabItems = tabNav ? tabNav.querySelectorAll(".liquid-tabs-item") : [];
        var tabContents = tabBlock.querySelectorAll(".liquid-tabs-container .liquid-tabs-tab");
        // タブのクリック処理
        tabItems.forEach(function(tabItem, index) {
            tabItem.addEventListener("click", function() {
                // すべてのタブアイテムから active クラスを除去
                tabItems.forEach(function(item) {
                    item.classList.remove("active");
                });
                // クリックされたタブに active クラスを追加
                tabItem.classList.add("active");
                // すべてのタブコンテンツを非表示にする
                tabContents.forEach(function(content) {
                    content.style.display = "none";
                });
                // 対応するタブコンテンツを表示する
                if (tabContents[index]) {
                    tabContents[index].style.display = "block";
                }
            });
        });
    
        // 初期状態：最初のタブを active にし、最初のコンテンツを表示する
        if (tabItems.length > 0 && tabContents.length > 0) {
            tabItems[0].classList.add("active");
            tabContents.forEach(function(content, i) {
                content.style.display = (i === 0 ? "block" : "none");
            });
        }
    });
      
});

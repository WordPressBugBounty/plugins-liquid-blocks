<?php
// slider
function liquid_blocks_render_slider( $attributes, $content ) {
    $uniqueId = uniqid();
    // ブロック属性から必要な情報を取得
    $align = !empty($attributes['align']) ? $attributes['align'] : '';
    $fields = isset( $attributes['fields'] ) ? $attributes['fields'] : [];
    $delay = isset( $attributes['delay'] ) ? (int) $attributes['delay'] : 3000;
    $slidesPerView = isset( $attributes['slidesPerView'] ) ? floatval($attributes['slidesPerView']) : 1.0;
    $animationType = isset( $attributes['animationType'] ) ? $attributes['animationType'] : 'slide';
    $autoPlay = isset( $attributes['autoPlay'] ) && $attributes['autoPlay'] === false ? 'autoplay: false' : 'autoplay: { delay: '.$delay.' }';
    $overlay = isset( $attributes['overlay'] ) && $attributes['overlay'] === false ? 'notOverlay' : '';

    // スライドショーのコンテナを開始
    $html = '<div class="liquid_slider swiper swiper_'.$uniqueId.' align'.esc_attr( $align ).'">'."\n";

    // 各フィールドセットの画像をループして表示
    $html .= '<div class="swiper-wrapper ' . esc_attr( $overlay ) . '">'."\n";
    foreach ( $fields as $field ) {
        $text = isset( $field['text'] ) ? $field['text'] : '';
        $textAlignment = isset( $field['textAlignment'] ) ? $field['textAlignment'] : 'start';
        $textFontSize = isset( $field['textFontSize'] ) ? $field['textFontSize'] : 16;
        $textTextColor = !empty( $field['textTextColor'] ) ? $field['textTextColor'] : 'inherit';
        $textBackgroundColor = !empty( $field['textBackgroundColor'] ) ? $field['textBackgroundColor'] : 'transparent';
        $url = isset( $field['url'] ) ? $field['url'] : '';
        $openInNewTab = !empty( $field['openInNewTab'] ) ? '_blank' : '_self';
        $image = isset( $field['image'] ) ? $field['image'] : '';
        $buttonText = isset( $field['buttonText'] ) ? $field['buttonText'] : '';
        $buttonAlignment = isset( $field['buttonAlignment'] ) ? $field['buttonAlignment'] : 'start';
        $buttonFontSize = isset( $field['buttonFontSize'] ) ? $field['buttonFontSize'] : 16;
        $buttonTextColor = !empty( $field['buttonTextColor'] ) ? $field['buttonTextColor'] : 'inherit';
        $buttonBackgroundColor = !empty( $field['buttonBackgroundColor'] ) ? $field['buttonBackgroundColor'] : 'transparent';
        $buttonBorderColor = !empty( $field['buttonBorderColor'] ) ? $field['buttonBorderColor'] : 'transparent';

        $html .= '<div class="swiper-slide">'."\n";
        if ( !empty( $url ) ) {
            $html .= '<a href="' . esc_url( $url ) . '" target="' . esc_attr( $openInNewTab ) . '">'."\n";
        }
        if ( !empty( $image ) ) {
            $html .= '<img src="' . esc_url( $image ) . '" alt="">'."\n";
        }
        $html .= '<div class="swiper-slide-container">'."\n";
        if ( !empty( $text ) ) {
            $html .= sprintf(
                '<div class="swiper-slide-text" style="text-align: %s; font-size: %spx; color: %s; background: %s;">%s</div>'."\n",
                esc_attr( $textAlignment ),
                esc_attr( $textFontSize ),
                esc_attr( $textTextColor ),
                esc_attr( $textBackgroundColor ),
                $text
            );
        }
        if ( !empty( $buttonText ) ) {
            $html .= sprintf(
                '<div class="swiper-slide-btn" style="text-align: %s; font-size: %spx; color: %s; background: %s; border-color: %s;">%s</div>'."\n",
                esc_attr( $buttonAlignment ),
                esc_attr( $buttonFontSize ),
                esc_attr( $buttonTextColor ),
                esc_attr( $buttonBackgroundColor ),
                esc_attr( $buttonBorderColor ),
                $buttonText
            );
        }
        $html .= '</div>'."\n";
        if ( !empty( $url ) ) {
            $html .= '</a>'."\n";
        }
        $html .= '</div>'."\n";
    }
    $html .= '</div>'."\n";

    $html .= '<div class="swiper-pagination"></div>'."\n";
    $html .= '<div class="swiper-button-prev"></div>'."\n";
    $html .= '<div class="swiper-button-next"></div>'."\n";

    // スライドショーのコンテナを終了
    $html .= '</div>'."\n";

    $html .= <<<EOM
    <script>
    document.addEventListener('DOMContentLoaded', function () {
        const swiper_{$uniqueId} = new Swiper('.swiper_{$uniqueId}', {
            loop: true,
            slidesPerView: {$slidesPerView},
            centeredSlides: true,
            spaceBetween: 0,
            effect: '{$animationType}',
            fadeEffect: {
                crossFade: true
            },
            {$autoPlay},
            keyboard: {
                enabled: true,
            },
            pagination: {
                el: '.swiper_{$uniqueId} .swiper-pagination',
                clickable: true
            },
            navigation: {
                nextEl: '.swiper_{$uniqueId} .swiper-button-next',
                prevEl: '.swiper_{$uniqueId} .swiper-button-prev'
            },
        });
    });
    </script>
    EOM;

    return $html;
}
?>
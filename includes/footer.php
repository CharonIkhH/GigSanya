<?php
/**
 * Функция для рендеринга футера сайта
 * 
 * @param array $options Параметры для настройки футера
 * @return string HTML-код футера
 */
function get_footer($options = []) {
    // Параметры по умолчанию
    $defaults = [
        'logo_path' => 'assets/templates/img/logo.png',
        'logo_alt' => 'GigSys - IT аутсорсинг и поддержка бизнеса',
        'company_description' => 'Комплексное ИТ-обслуживание для бизнеса любого масштаба. Предоставляем полный спектр услуг по внедрению и поддержке ИТ-инфраструктуры.',
        'copyright_year' => date('Y'),
        'company_name' => 'GigSys IT-solutions'
    ];
    
    // Объединяем параметры по умолчанию с переданными
    $options = array_merge($defaults, $options);
    
    // Начинаем буферизацию вывода
    ob_start();
?>
<!-- ============================================= -->
<!-- FOOTER SECTION (SEO OPTIMIZED)                -->
<!-- ============================================= -->
<footer class="site-footer" itemscope itemtype="http://schema.org/Organization">
    <div class="footer-waves">
        <div class="footer-wave footer-wave-1"></div>
        <div class="footer-wave footer-wave-2"></div>
        <div class="footer-wave footer-wave-3"></div>
    </div>
    
    <div class="footer-widgets">
        <div class="container">
            <div class="row">
                
                <!-- ========== БЛОК О КОМПАНИИ ========== -->
                <div class="col-lg-4 col-md-6">
                    <div class="footer-widget about-widget">
                        <div class="footer-logo" itemprop="logo">
                            <img src="<?php echo $options['logo_path']; ?>" 
                                 alt="<?php echo $options['logo_alt']; ?>" 
                                 width="180" 
                                 height="50"
                                 loading="lazy">
                        </div>
                        <p itemprop="description"><?php echo $options['company_description']; ?></p>
                        
                        <!-- СОЦИАЛЬНЫЕ СЕТИ С MICRODATA -->
                        <div class="footer-social" aria-label="Социальные сети">
                            <a href="#" itemprop="sameAs" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" itemprop="sameAs" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" itemprop="sameAs" aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" itemprop="sameAs" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- ========== НАВИГАЦИОННЫЕ ССЫЛКИ ========== -->
                <div class="col-lg-2 col-md-6">
                    <nav class="footer-widget links-widget" aria-label="Дополнительная навигация">
                        <h4 class="widget-title">Компания</h4>
                        <ul>
                            <li><a href="index.html" itemprop="url">Главная</a></li>
                            <li><a href="o-kompanii.html">О компании</a></li>
                            <li><a href="novosti/index.html">Новости</a></li>
                            <li><a href="kontaktyi.html">Контакты</a></li>
                        </ul>
                    </nav>
                </div>

                <!-- ========== СПИСОК УСЛУГ ========== -->
                <div class="col-lg-3 col-md-6">
                    <div class="footer-widget services-widget">
                        <h4 class="widget-title">Услуги</h4>
                        <ul>
                            <li><a href="it-support.html">IT-поддержка</a></li>
                            <li><a href="it-autsorsing.html">IT-аутсорсинг</a></li>
                            <li><a href="virtual-office.html">Защищенный офис</a></li>
                            <li><a href="obsluzhivanie-serverov.html">Серверы</a></li>
                        </ul>
                    </div>
                </div>

                <!-- ========== КОНТАКТЫ С MICRODATA ========== -->
                <div class="col-lg-3 col-md-6">
                    <div class="footer-widget contact-widget" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                        <h4 class="widget-title">Контакты</h4>
                        <ul class="contact-list">
                            <li>
                                <i class="fa fa-map-marker-alt"></i>
                                <span itemprop="streetAddress">Ракетный бульвар, д.15, оф.31</span>, 
                                <span itemprop="addressLocality">Москва</span>
                            </li>
                            <li>
                                <i class="fas fa-phone-alt"></i>
                                <a href="tel:88003501160" itemprop="telephone">8(499)350-11-60</a>
                            </li>
                            <li>
                                <i class="fa fa-envelope"></i>
                                <a href="mailto:it@gigsys.ru" itemprop="email">it@gigsys.ru</a>
                            </li>
                            <li>
                                <i class="fa fa-clock"></i>
                                <span itemprop="openingHours">Пн-Пт: 9:00 - 18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- ========== КОПИРАЙТ И ЮРИДИЧЕСКИЕ ССЫЛКИ ========== -->
    <div class="footer-bottom">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6">
                    <div class="copyright">
                        <p>&copy; <span itemprop="copyrightYear"><?php echo $options['copyright_year']; ?></span> 
                        <span itemprop="name"><?php echo $options['company_name']; ?></span>. Все права защищены</p>
                    </div>
                </div>
                <div class="col-lg-6">
                    <nav class="footer-bottom-links text-lg-right" aria-label="Юридическая информация">
                        <a href="privacy-policy.html">Политика конфиденциальности</a>
                        <a href="terms.html">Пользовательское соглашение</a>
                    </nav>
                </div>
            </div>
        </div>
    </div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Здесь может быть инициализация дополнительных скриптов, связанных с футером
    
    // Убираем код добавления волн, так как они уже включены в HTML-структуру
});
</script>
<?php
    // Возвращаем буферизированный контент
    return ob_get_clean();
}

/**
 * Выводит футер напрямую
 * 
 * @param array $options Параметры для настройки футера
 * @return void Выводит HTML-код футера
 */
function render_footer($options = []) {
    echo get_footer($options);
}
?>

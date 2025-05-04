<?php
/**
 * Компонент хедера сайта
 * 
 * Этот файл содержит хедер сайта, включая навигацию и мега-меню
 */

// Определяем текущую страницу для активных пунктов меню
$currentPage = basename($_SERVER['PHP_SELF'], '.php');

// Функция для определения активного пункта меню
function isActive($page) {
    global $currentPage;
    return $currentPage === $page ? 'active' : '';
}

// Определяем переменные по умолчанию, если они не установлены
if (!isset($pageTitle)) {
    $pageTitle = 'GigSys - IT-аутсорсинг в Москве';
}

// Массив с пунктами меню для динамического формирования
$mainMenuItems = [
    ['url' => 'index.php', 'name' => 'Главная'],
    ['url' => 'o-kompanii.php', 'name' => 'О компании'],
    ['url' => 'landing.php', 'name' => 'Мероприятия'],
    [
        'url' => '#', 
        'name' => 'Услуги', 
        'hasChildren' => true,
        'class' => 'services-toggle'
    ],
    ['url' => 'kontaktyi.php', 'name' => 'Контакты']
];
?>
<!-- Структура хедера с улучшенной семантикой и микроразметкой -->
<div class="container">
    <header class="header-modern" id="main-header" itemscope itemtype="http://schema.org/WPHeader">
      <div class="header-wrapper">
        <!-- Логотип с улучшенными атрибутами -->
        <div class="logo-box" itemscope itemtype="http://schema.org/Organization">
          <a href="index.php" class="logo-link" title="GigSys - IT аутсорсинг и поддержка бизнеса">
            <img src="assets/templates/img/logo2.webp" alt="GigSys - IT-аутсорсинг и поддержка" width="180" height="50" itemprop="logo" loading="eager">
            <meta itemprop="name" content="GigSys">
            <meta itemprop="url" content="https://gigsys.ru">
          </a>
        </div>
        
        <!-- Главная навигация (десктоп) с микроразметкой -->
        <nav class="desktop-nav" itemscope itemtype="http://schema.org/SiteNavigationElement" aria-label="Основная навигация">
          <ul class="main-menu" role="menubar">
            <?php foreach ($mainMenuItems as $item): ?>
                <li class="<?= isset($item['hasChildren']) ? 'menu-item-has-children' : '' ?> <?= isActive(pathinfo($item['url'], PATHINFO_FILENAME)) ?>" role="menuitem">
                    <a href="<?= $item['url'] ?>" 
                       <?= isset($item['class']) ? 'class="' . $item['class'] . '"' : '' ?>
                       <?= isset($item['hasChildren']) ? 'aria-haspopup="true" aria-expanded="false" aria-controls="mega-menu-services"' : '' ?>
                       itemprop="url">
                        <?php if (isset($item['icon'])): ?>
                            <span class="toggle-icon"><i class="<?= $item['icon'] ?>" aria-hidden="true"></i></span>
                        <?php endif; ?>
                        <span <?= isset($item['hasChildren']) ? 'class="toggle-text"' : '' ?> itemprop="name"><?= $item['name'] ?></span>
                        <?php if (isset($item['hasChildren'])): ?>
                            <span class="toggle-arrow"><i class="fas fa-chevron-down" aria-hidden="true"></i></span>
                        <?php endif; ?>
                    </a>
                    
                    <?php if (isset($item['hasChildren'])): ?>
                    <!-- Мега-меню с улучшенной семантикой -->
                    <div class="mega-menu" id="mega-menu-services" role="region" aria-label="Меню услуг">
                        <!-- Мобильная кнопка закрытия -->
                        <button class="mega-menu-close d-md-none" aria-label="Закрыть меню">
                          <i class="fas fa-times" aria-hidden="true"></i>
                        </button>
                        
                        <!-- Верхняя навигация по меню с микроразметкой и улучшенной доступностью -->
                        <div class="mega-menu-header">
                          <div class="container">
                            <div class="menu-categories" role="tablist" aria-label="Категории услуг">
                              <button class="menu-category active" 
                                      data-category="it" 
                                      role="tab" 
                                      id="tab-it" 
                                      aria-selected="true" 
                                      aria-controls="panel-it">ИТ-услуги</button>
                              <button class="menu-category" 
                                      data-category="infra" 
                                      role="tab" 
                                      id="tab-infra" 
                                      aria-selected="false" 
                                      aria-controls="panel-infra">Инфраструктура</button>
                              <button class="menu-category" 
                                      data-category="security" 
                                      role="tab" 
                                      id="tab-security" 
                                      aria-selected="false" 
                                      aria-controls="panel-security">Безопасность</button>
                              <button class="menu-category" 
                                      data-category="software" 
                                      role="tab" 
                                      id="tab-software" 
                                      aria-selected="false" 
                                      aria-controls="panel-software">ПО и сервисы</button>
                            </div>
                          </div>
                        </div>

                        <!-- Основной контент меню с микроразметкой для каждой услуги -->
                        <div class="mega-menu-content">
                          <div class="container">
                            <!-- ИТ-услуги -->
                            <div class="menu-panel active" 
                                data-panel="it" 
                                role="tabpanel" 
                                id="panel-it" 
                                aria-labelledby="tab-it">
                              <div class="menu-panel-grid">
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-headset" aria-hidden="true"></i>
                                      Поддержка и аутсорсинг
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="it-support.php">
                                          <span class="link-icon"><i class="fas fa-user-headset" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">IT-поддержка</span>
                                            <span class="link-desc" itemprop="description">Профессиональная поддержка вашего бизнеса</span>
                                            <meta itemprop="serviceType" content="IT Support">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="it-podderzhka.php">
                                          <span class="link-icon"><i class="fas fa-users-cog" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">IT-аутсорсинг</span>
                                            <span class="link-desc" itemprop="description">Комплексное обслуживание инфраструктуры</span>
                                            <meta itemprop="serviceType" content="IT Outsourcing">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="virtual-office.php">
                                          <span class="link-icon"><i class="fas fa-laptop-house" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Виртуальный офис</span>
                                            <span class="link-desc" itemprop="description">Защищенное рабочее пространство</span>
                                            <meta itemprop="serviceType" content="Virtual Office">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-info-circle" aria-hidden="true"></i>
                                      О компании
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem">
                                        <a href="o-kompanii.php">
                                          <span class="link-icon"><i class="fas fa-building" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title">О нас</span>
                                            <span class="link-desc">История и ценности компании</span>
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem">
                                        <a href="kontaktyi.php">
                                          <span class="link-icon"><i class="fas fa-address-card" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title">Контакты</span>
                                            <span class="link-desc">Свяжитесь с нашими специалистами</span>
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem">
                                        <a href="landing.php">
                                          <span class="link-icon"><i class="fas fa-newspaper" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title">Мероприятия</span>
                                            <span class="link-desc">Актуальные события</span>
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <!-- Выделенное предложение с микроразметкой -->
                                <div class="menu-panel-highlight" itemscope itemtype="http://schema.org/Offer">
                                  <div class="highlight-content">
                                    <div class="highlight-badge">Популярное</div>
                                    <h3 itemprop="name">Выгодный IT-аутсорсинг</h3>
                                    <p itemprop="description">Альтернатива штатным специалистам. Экономия до 30% на IT-затратах.</p>
                                    <a href="it-poddergka.php" class="highlight-btn" itemprop="url">
                                      Подробнее
                                      <i class="fas fa-long-arrow-right" aria-hidden="true"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Инфраструктура -->
                            <div class="menu-panel" 
                                data-panel="infra" 
                                role="tabpanel" 
                                id="panel-infra" 
                                aria-labelledby="tab-infra">
                              <div class="menu-panel-grid">
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-server" aria-hidden="true"></i>
                                      Серверы и сети
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="obsluzhivanie-serverov.php">
                                          <span class="link-icon"><i class="fas fa-wrench" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Обслуживание серверов</span>
                                            <span class="link-desc" itemprop="description">Техническая поддержка и мониторинг</span>
                                            <meta itemprop="serviceType" content="Server Maintenance">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="montazh-kompyuternykh-setey.php">
                                          <span class="link-icon"><i class="fas fa-network-wired" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Монтаж компьютерных сетей</span>
                                            <span class="link-desc" itemprop="description">Проектирование и развертывание сетей</span>
                                            <meta itemprop="serviceType" content="Network Installation">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-cloud" aria-hidden="true"></i>
                                      Облачные решения
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="hosting.php">
                                          <span class="link-icon"><i class="fas fa-server" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Хостинг</span>
                                            <span class="link-desc" itemprop="description">Надежный хостинг для ваших проектов</span>
                                            <meta itemprop="serviceType" content="Hosting">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="virtual-office.php">
                                          <span class="link-icon"><i class="fas fa-desktop" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Виртуальный офис</span>
                                            <span class="link-desc" itemprop="description">Работа из любой точки мира</span>
                                            <meta itemprop="serviceType" content="Virtual Office">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <!-- Выделенное предложение с микроразметкой -->
                                <div class="menu-panel-highlight infra-highlight" itemscope itemtype="http://schema.org/Offer">
                                  <div class="highlight-content">
                                    <div class="highlight-badge">Выгодно</div>
                                    <h3 itemprop="name">Обслуживание серверов</h3>
                                    <p itemprop="description">Профессиональное администрирование и мониторинг с гарантией 99.9% работоспособности</p>
                                    <a href="obsluzhivanie-serverov.php" class="highlight-btn" itemprop="url">
                                      Подробнее
                                      <i class="fas fa-long-arrow-right" aria-hidden="true"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <!-- Безопасность -->
                            <div class="menu-panel" 
                                data-panel="security" 
                                role="tabpanel" 
                                id="panel-security" 
                                aria-labelledby="tab-security">
                              <div class="menu-panel-grid">
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-shield-alt" aria-hidden="true"></i>
                                      Кибербезопасность
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="it-podderzhka.php#security">
                                          <span class="link-icon"><i class="fas fa-lock" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Информационная безопасность</span>
                                            <span class="link-desc" itemprop="description">Комплексная защита IT-систем</span>
                                            <meta itemprop="serviceType" content="Information Security">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="virtual-office.php">
                                          <span class="link-icon"><i class="fas fa-virus-slash" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Защищенный офис</span>
                                            <span class="link-desc" itemprop="description">Безопасное рабочее пространство</span>
                                            <meta itemprop="serviceType" content="Secure Office">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-video" aria-hidden="true"></i>
                                      Физическая безопасность
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="ustanovka-videonablyudeniya.php">
                                          <span class="link-icon"><i class="fas fa-camera" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Видеонаблюдение</span>
                                            <span class="link-desc" itemprop="description">Установка камер в офисы</span>
                                            <meta itemprop="serviceType" content="Video Surveillance">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="montazh-kompyuternykh-setey.php#security">
                                          <span class="link-icon"><i class="fas fa-key" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Защита сетей</span>
                                            <span class="link-desc" itemprop="description">Безопасность сетевой инфраструктуры</span>
                                            <meta itemprop="serviceType" content="Network Security">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <!-- Выделенное предложение с микроразметкой -->
                                <div class="menu-panel-highlight security-highlight" itemscope itemtype="http://schema.org/Offer">
                                  <div class="highlight-content">
                                    <div class="highlight-badge">Рекомендуем</div>
                                    <h3 itemprop="name">Установка видеонаблюдения</h3>
                                    <p itemprop="description">Современные системы видеонаблюдения для вашего офиса с удаленным доступом</p>
                                    <a href="ustanovka-videonablyudeniya.php" class="highlight-btn" itemprop="url">
                                      Подробнее
                                      <i class="fas fa-long-arrow-right" aria-hidden="true"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            <!-- ПО и сервисы -->
                            <div class="menu-panel" 
                                data-panel="software" 
                                role="tabpanel" 
                                id="panel-software" 
                                aria-labelledby="tab-software">
                              <div class="menu-panel-grid">
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-laptop-code" aria-hidden="true"></i>
                                      Разработка
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="landing.php">
                                          <span class="link-icon"><i class="fas fa-globe" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Разработка лендингов</span>
                                            <span class="link-desc" itemprop="description">Создание продающих страниц</span>
                                            <meta itemprop="serviceType" content="Landing Page Development">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="virtual-office.php#solutions">
                                          <span class="link-icon"><i class="fas fa-code" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Облачные решения</span>
                                            <span class="link-desc" itemprop="description">Программные продукты для бизнеса</span>
                                            <meta itemprop="serviceType" content="Cloud Solutions">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <div class="menu-column">
                                  <div class="menu-group">
                                    <h4 class="menu-group-title">
                                      <i class="fas fa-calculator" aria-hidden="true"></i>
                                      Бизнес-приложения
                                    </h4>
                                    <ul class="menu-list" role="menu">
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="uslugi-1c.php">
                                          <span class="link-icon"><i class="fas fa-calculator" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">Услуги 1С</span>
                                            <span class="link-desc" itemprop="description">Внедрение и поддержка 1С</span>
                                            <meta itemprop="serviceType" content="1C Services">
                                          </span>
                                        </a>
                                      </li>
                                      <li role="menuitem" itemscope itemtype="http://schema.org/Service">
                                        <a href="prostoe-reshenie-slozhnyix-zadach.php">
                                          <span class="link-icon"><i class="fas fa-cloud-download-alt" aria-hidden="true"></i></span>
                                          <span class="link-content">
                                            <span class="link-title" itemprop="name">1С ФРЕШ</span>
                                            <span class="link-desc" itemprop="description">Преимущества облачной 1С</span>
                                            <meta itemprop="serviceType" content="1C Fresh">
                                          </span>
                                        </a>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                                
                                <!-- Выделенное предложение с микроразметкой -->
                                <div class="menu-panel-highlight software-highlight" itemscope itemtype="http://schema.org/Offer">
                                  <div class="highlight-content">
                                    <div class="highlight-badge">Акция</div>
                                    <h3 itemprop="name">1С ФРЕШ в облаке</h3>
                                    <p itemprop="description">Простое решение сложных задач. Преимущества облачной версии 1С.</p>
                                    <a href="prostoe-reshenie-slozhnyix-zadach.php" class="highlight-btn" itemprop="url">
                                      Подробнее
                                      <i class="fas fa-long-arrow-right" aria-hidden="true"></i>
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <!-- Футер меню с микроразметкой -->
                        <div class="mega-menu-footer">
                          <div class="container">
                            <div class="mm-footer-content">
                              <div class="mm-footer-cta">
                                <p>Нужна консультация специалиста?</p>
                                <a href="kontaktyi.php" class="mm-cta-btn" itemscope itemtype="http://schema.org/ContactPoint">
                                  <i class="fas fa-phone-alt" aria-hidden="true"></i>
                                  <span itemprop="name">Получить консультацию</span>
                                  <meta itemprop="contactType" content="customer support">
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                    </div>
                    <?php endif; ?>
                </li>
            <?php endforeach; ?>
          </ul>
        </nav>
        
        <!-- Контактная информация с микроразметкой -->
        <div class="header-contacts" itemscope itemtype="http://schema.org/Organization">
          <meta itemprop="name" content="GigSys">
          <div class="contact-item">
            <a href="#map-modal" class="popup-with-form contact-link">
              <div class="contact-icon">
                <i class="fa fa-map-marker-alt" aria-hidden="true"></i>
              </div>
              <div class="contact-text">
                <div class="contact-label">Адрес офиса</div>
                <div class="contact-info" itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                  <span itemprop="addressLocality">г. Москва</span>, 
                  <span itemprop="streetAddress">Ракетный бульвар, д.15, оф.31</span>
                </div>
              </div>
            </a>
          </div>
          
          <div class="contact-item">
            <a href="tel:88003501160" class="contact-link" itemprop="telephone">
              <div class="contact-icon">
                <i class="fa fa-phone-alt" aria-hidden="true"></i>
              </div>
              <div class="contact-text">
                <div class="contact-label">Телефон</div>
                <div class="contact-info">8 (499) 350-11-60</div>
              </div>
            </a>
          </div>
          
          <!-- Добавление скрытых полей для SEO -->
          <meta itemprop="email" content="it@gigsys.ru">
          <meta itemprop="url" content="https://gigsys.ru">
          <meta itemprop="foundingDate" content="2010">
        </div>
        
        <!-- CTA Buttons с вертикальным расположением -->
        <div class="header-actions vertical">
          <a href="#callback" class="btn btn-primary popup-with-form" rel="nofollow">
            <i class="fas fa-headset" aria-hidden="true"></i>
            <span>Заказать звонок</span>
          </a>
          
          <a href="http://lk.gigsys.ru/hd/customer.pl" target="_blank" class="btn btn-outline" rel="noopener">
            <i class="fas fa-user-circle" aria-hidden="true"></i>
            <span>Личный кабинет</span>
          </a>
        </div>
        
        <!-- Мобильное меню (бургер) -->
        <button class="mobile-menu-toggle" 
                aria-label="Открыть меню" 
                aria-expanded="false" 
                aria-controls="mobile-menu">
          <div class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
      
      <!-- Мобильное меню (выпадающее) с улучшенной доступностью -->
      <div class="mobile-menu" id="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-header">
          <div class="mobile-logo">
            <a href="index.php">
              <img src="assets/templates/img/logo.png" alt="GigSys - IT аутсорсинг" width="140" height="35" loading="lazy">
            </a>
          </div>
          <button class="mobile-menu-close" aria-label="Закрыть меню">
            <i class="fas fa-times" aria-hidden="true"></i>
          </button>
        </div>
        
        <div class="mobile-menu-content">
          <div class="mobile-search">
            <form action="search.php" method="get" role="search">
              <input type="text" name="q" placeholder="Поиск..." aria-label="Поиск">
              <button type="submit" aria-label="Искать"><i class="fa fa-search" aria-hidden="true"></i></button>
            </form>
          </div>
          
          <!-- Мобильная навигация с микроразметкой -->
          <nav class="mobile-nav" itemscope itemtype="http://schema.org/SiteNavigationElement">
            <ul>
              <li class="<?= isActive('index') ?>"><a href="index.php" itemprop="url"><span itemprop="name">Главная</span></a></li>
              <li class="<?= isActive('o-kompanii') ?>"><a href="o-kompanii.php" itemprop="url"><span itemprop="name">О компании</span></a></li>
              <li class="<?= isActive('landing') ?>"><a href="landing.php" itemprop="url"><span itemprop="name">Мероприятия</span></a></li>
              <li class="has-dropdown">
                <a href="#" aria-expanded="false" aria-haspopup="true">
                  <span itemprop="name">Услуги</span> <i class="fas fa-chevron-down" aria-hidden="true"></i>
                </a>
                <ul class="mobile-submenu">
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="it-support.php" itemprop="url">
                      <i class="fas fa-headset" aria-hidden="true"></i> 
                      <span itemprop="name">IT-поддержка</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="it-autsorsing.php" itemprop="url">
                      <i class="fas fa-tasks" aria-hidden="true"></i> 
                      <span itemprop="name">IT-аутсорсинг</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="virtual-office.php" itemprop="url">
                      <i class="fas fa-shield-alt" aria-hidden="true"></i> 
                      <span itemprop="name">Защищенный офис</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="obsluzhivanie-serverov.php" itemprop="url">
                      <i class="fas fa-server" aria-hidden="true"></i> 
                      <span itemprop="name">Серверы</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="montazh-kompyuternykh-setey.php" itemprop="url">
                      <i class="fas fa-network-wired" aria-hidden="true"></i> 
                      <span itemprop="name">Офисные сети</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="ustanovka-videonablyudeniya.php" itemprop="url">
                      <i class="fas fa-video" aria-hidden="true"></i> 
                      <span itemprop="name">Видеонаблюдение</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="uslugi-1c.php" itemprop="url">
                      <i class="fas fa-calculator" aria-hidden="true"></i> 
                      <span itemprop="name">Услуги 1С</span>
                    </a>
                  </li>
                  <li itemscope itemtype="http://schema.org/Service">
                    <a href="hosting.php" itemprop="url">
                      <i class="fas fa-cloud" aria-hidden="true"></i> 
                      <span itemprop="name">Хостинг</span>
                    </a>
                  </li>
                </ul>
              </li>
              <li class="<?= isActive('kontaktyi') ?>"><a href="kontaktyi.php" itemprop="url"><span itemprop="name">Контакты</span></a></li>
            </ul>
          </nav>
          
          <!-- Контактная информация для мобильного меню с микроразметкой -->
          <div class="mobile-contacts" itemscope itemtype="http://schema.org/Organization">
            <meta itemprop="name" content="GigSys">
            <div class="mobile-contact-item">
              <i class="fa fa-phone" aria-hidden="true"></i>
              <a href="tel:88003501160" itemprop="telephone">8(499)350-11-60</a>
            </div>
            <div class="mobile-contact-item">
              <i class="fa fa-envelope" aria-hidden="true"></i>
              <a href="mailto:it@gigsys.ru" itemprop="email">it@gigsys.ru</a>
            </div>
            <div class="mobile-contact-item">
              <i class="fa fa-map-marker" aria-hidden="true"></i>
              <address itemprop="address" itemscope itemtype="http://schema.org/PostalAddress">
                <span itemprop="addressLocality">г. Москва</span>, 
                <span itemprop="streetAddress">Ракетный бульвар, д.15, оф.31</span>
              </address>
            </div>
          </div>
          
          <!-- Кнопки действий в мобильном меню -->
          <div class="mobile-actions">
            <a href="#callback" class="btn btn-primary popup-with-form" rel="nofollow">
              <i class="fas fa-headset" aria-hidden="true"></i>
              <span>Заказать звонок</span>
            </a>
            
            <a href="http://lk.gigsys.ru/hd/customer.pl" target="_blank" class="btn btn-outline" rel="noopener">
              <i class="fas fa-user-circle" aria-hidden="true"></i>
              <span>Личный кабинет</span>
            </a>
          </div>
        </div>
      </div>
      
      <!-- Roistat script с async и defer для ускорения загрузки -->
      <script src="https://widget.roistat.com/widget/s8xWAIxVHJ" async defer></script>
    </header>
</div>

<!-- Добавлены JSON-LD данные для поисковых систем -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GigSys",
  "url": "https://gigsys.ru",
  "logo": "https://gigsys.ru/assets/templates/img/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+84993501160",
    "contactType": "customer service",
    "areaServed": "RU",
    "availableLanguage": "Russian"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressRegion": "Москва",
    "streetAddress": "Ракетный бульвар, д.15, оф.31",
    "addressCountry": "RU"
  },
  "sameAs": [
    "https://vk.com/gigsys",
    "https://www.facebook.com/gigsys"
  ]
}
</script>

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "url": "https://gigsys.ru/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://gigsys.ru/search.php?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>

<!-- JavaScript для хедера - Оптимизирован -->
<script>
/**
 * Оптимизированный JavaScript для хедера и мега-меню
 * - Исправлено открытие/закрытие меню по клику на кнопку
 * - Улучшена производительность
 * - Убраны все ховеры, активация строго по клику
 */

document.addEventListener('DOMContentLoaded', function() {
    // === БАЗОВЫЕ ЭЛЕМЕНТЫ ===
    // Хедер и мобильное меню
    const header = document.getElementById('main-header');
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const dropdowns = document.querySelectorAll('.has-dropdown');
    
    // Мега-меню
    const servicesToggle = document.querySelector('.services-toggle');
    const megaMenu = document.querySelector('.mega-menu');
    let megaMenuClose = document.querySelector('.mega-menu-close');
    const menuCategories = document.querySelectorAll('.menu-category');
    const menuPanels = document.querySelectorAll('.menu-panel');
    
    // Дополнительные элементы
    const anchorLinks = document.querySelectorAll('.mega-menu a[href*="#"]');
    const actionButtons = document.querySelectorAll('.highlight-btn, .mm-cta-btn');
    
    // === СОСТОЯНИЕ ===
    let isMegaMenuOpen = false;
    let isAnimating = false;
    
    // === ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ===
    // Анимация с проверкой на поддержку
    function animateElement(element, isOpening, callback) {
        if (!element) return;
        
        isAnimating = true;
        
        // Сбрасываем предыдущие анимации
        element.style.animation = '';
        
        // Применяем анимацию
        setTimeout(() => {
            element.style.animation = isOpening 
                ? 'fadeIn 300ms forwards' 
                : 'fadeOut 250ms forwards';
            
            // Ждем завершения анимации
            setTimeout(() => {
                isAnimating = false;
                if (callback) callback();
            }, isOpening ? 300 : 250);
        }, 10);
    }
    
    // Добавление стилей анимации
    function addAnimationStyles() {
        if (document.getElementById('mega-menu-animations')) return;
        
        const style = document.createElement('style');
        style.id = 'mega-menu-animations';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: translateY(0); }
                to { opacity: 0; transform: translateY(10px); }
            }
            .btn-pressed {
                transform: scale(0.95) !important;
                transition: transform 0.2s !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    // === ОСНОВНЫЕ ФУНКЦИИ ===
    // Переключатель мега-меню
    function toggleMegaMenu(forceState) {
        if (!megaMenu || isAnimating) return;
        
        // Определяем новое состояние
        const willOpen = forceState !== undefined ? forceState : !isMegaMenuOpen;
        
        console.log('Toggle mega menu:', willOpen ? 'opening' : 'closing'); // отладка
        
        if (willOpen) {
            // Открываем меню
            megaMenu.classList.add('active');
            document.body.classList.add('mega-menu-open');
            
            if (servicesToggle) {
                servicesToggle.setAttribute('aria-expanded', 'true');
            }
            
            animateElement(megaMenu, true, function() {
                // Фокус на первую категорию для доступности
                const activeCategory = document.querySelector('.menu-category.active');
                if (activeCategory) activeCategory.focus();
            });
            
            // Закрываем мобильное меню если оно открыто
            if (mobileMenu && mobileMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        } else {
            // Закрываем меню
            animateElement(megaMenu, false, function() {
                megaMenu.classList.remove('active');
                document.body.classList.remove('mega-menu-open');
                
                if (servicesToggle) {
                    servicesToggle.setAttribute('aria-expanded', 'false');
                    servicesToggle.focus();
                }
            });
        }
        
        // Устанавливаем новое состояние
        isMegaMenuOpen = willOpen;
    }
    
    // Создание кнопки закрытия
    function createCloseButton() {
        if (megaMenu && !megaMenuClose) {
            const closeButton = document.createElement('button');
            closeButton.className = 'mega-menu-close';
            closeButton.setAttribute('aria-label', 'Закрыть меню');
            closeButton.innerHTML = '<i class="fas fa-times"></i>';
            megaMenu.prepend(closeButton);
            
            // Обновляем ссылку
            megaMenuClose = closeButton;
            
            // Добавляем обработчик
            megaMenuClose.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                toggleMegaMenu(false);
            });
        }
    }
    
    // Обработка скролла
    function setupScrollHandler() {
        if (!header) return;
        
        function handleScroll() {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        
        // Инициализация
        handleScroll();
        
        // Оптимизированный обработчик
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(function() {
                    handleScroll();
                    scrollTimeout = null;
                }, 100);
            }
        }, { passive: true });
    }
    
    // === ИНИЦИАЛИЗАЦИЯ ===
    // Добавляем стили анимаций
    addAnimationStyles();
    
    // Настраиваем хедер
    setupScrollHandler();
    
    // Создаем кнопку закрытия для мега-меню
    createCloseButton();
    
    // === ОБРАБОТЧИКИ СОБЫТИЙ ===
    // Обработчик кнопки "Услуги" для открытия/закрытия мега-меню
    if (servicesToggle && megaMenu) {
        servicesToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMegaMenu(); // Переключаем состояние
        });
        
        // Устанавливаем начальные атрибуты для доступности
        servicesToggle.setAttribute('aria-haspopup', 'true');
        servicesToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Закрытие мега-меню при клике вне
    document.addEventListener('click', function(e) {
        if (isMegaMenuOpen && 
            megaMenu && 
            !megaMenu.contains(e.target) && 
            !servicesToggle.contains(e.target)) {
            toggleMegaMenu(false);
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMegaMenuOpen) {
            toggleMegaMenu(false);
        }
    });
    
    // Обработка кнопок внутри мега-меню
    actionButtons.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Эффект нажатия
            btn.classList.add('btn-pressed');
            
            setTimeout(function() {
                btn.classList.remove('btn-pressed');
                
                // Закрываем мега-меню
                if (isMegaMenuOpen) {
                    setTimeout(function() {
                        toggleMegaMenu(false);
                    }, 100);
                }
            }, 200);
        });
    });
    
    // Обработка ссылок с якорями
    anchorLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (!href) return;
            
            const isAnchor = href.indexOf('#') === 0 || href.indexOf('/#') !== -1;
            
            if (isAnchor) {
                // Закрываем мега-меню после клика на якорную ссылку
                toggleMegaMenu(false);
            }
        });
    });
    
    // Обработка мобильного меню
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Закрываем мега-меню, если оно открыто
            if (isMegaMenuOpen) {
                toggleMegaMenu(false);
            }
            
            // Переключаем мобильное меню
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Закрытие мобильного меню
        if (mobileMenuClose) {
            mobileMenuClose.addEventListener('click', function(e) {
                e.preventDefault();
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        }
        
        // Закрытие при клике вне меню
        document.addEventListener('click', function(e) {
            if (mobileMenu.classList.contains('active') && 
                !mobileMenu.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                mobileMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Обработка выпадающих списков
    dropdowns.forEach(function(dropdown) {
        const link = dropdown.querySelector('a');
        
        if (link) {
            link.addEventListener('click', function(e) {
                // Предотвращаем переход для выпадающих меню
                e.preventDefault();
                
                // Закрываем другие открытые дропдауны
                dropdowns.forEach(function(otherDropdown) {
                    if (otherDropdown !== dropdown && otherDropdown.classList.contains('active')) {
                        otherDropdown.classList.remove('active');
                    }
                });
                
                // Переключаем текущий дропдаун
                dropdown.classList.toggle('active');
            });
        }
    });
    
    // Обработка категорий в мега-меню
    if (menuCategories.length > 0 && menuPanels.length > 0) {
        menuCategories.forEach(function(category) {
            category.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Пропускаем если категория уже активна
                if (category.classList.contains('active')) return;
                
                const targetPanel = category.getAttribute('data-category');
                
                // Активация категории
                menuCategories.forEach(function(cat) {
                    cat.classList.remove('active');
                });
                category.classList.add('active');
                
                // Активация панели
                menuPanels.forEach(function(panel) {
                    panel.classList.remove('active');
                    if (panel.getAttribute('data-panel') === targetPanel) {
                        panel.classList.add('active');
                        // Анимация новой панели
                        panel.style.animation = 'fadeIn 300ms forwards';
                    }
                });
            });
            
            // Навигация с клавиатуры
            category.addEventListener('keydown', function(e) {
                const index = Array.from(menuCategories).indexOf(category);
                let nextIndex;
                
                switch(e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        nextIndex = index + 1 >= menuCategories.length ? 0 : index + 1;
                        menuCategories[nextIndex].focus();
                        menuCategories[nextIndex].click();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        nextIndex = index - 1 < 0 ? menuCategories.length - 1 : index - 1;
                        menuCategories[nextIndex].focus();
                        menuCategories[nextIndex].click();
                        break;
                }
            });
        });
        
        // Активация первой панели и категории по умолчанию
        if (!document.querySelector('.menu-panel.active')) {
            const firstCategory = menuCategories[0];
            const firstPanel = menuPanels[0];
            
            if (firstCategory && firstPanel) {
                firstCategory.classList.add('active');
                firstPanel.classList.add('active');
            }
        }
    }
    
    // Обработка якорей в URL
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(function() {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }
});
</script>

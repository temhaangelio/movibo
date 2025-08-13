#!/bin/bash

# Proje dizinine git
cd /var/www/movibo || exit 1

# Git dizinini güvenli olarak işaretle (gerekiyorsa)
git config --global --add safe.directory /var/www/movibo

# Eski commit'i al (composer dosyaları değişiklik kontrolü için)
OLD_COMMIT=$(git rev-parse HEAD 2>/dev/null)

# Git güncellemelerini fetch ve reset et
git fetch --all
git reset --hard origin/main

# Yeni commit'i al
NEW_COMMIT=$(git rev-parse HEAD 2>/dev/null)

# composer.json veya composer.lock değiştiyse composer update çalıştır
if [ -n "$OLD_COMMIT" ] && [ -n "$NEW_COMMIT" ]; then
    if git diff --name-only "$OLD_COMMIT" "$NEW_COMMIT" | grep -q "composer.json\|composer.lock"; then
        echo "composer.json veya composer.lock değişmiş, composer update çalıştırılıyor..."
        composer update
    else
        echo "composer dosyaları değişmedi, composer update atlanıyor."
    fi
else
    echo "Commit bilgisi alınamadı, composer dosyaları kontrolü atlandı."
fi

# Dosya izinlerini düzelt

sudo chown -R www-data:www-data /var/www/movibo/bootstrap
sudo chmod -R 775 /var/www/movibo/bootstrap

#sudo chown -R www-data:www-data /var/www/movibo/public/storage
#sudo chmod -R 775 /var/www/movibo/public/storage

# Scriptin kendisini çalıştırılabilir yap
chmod +x /var/www/movibo/update_project.sh

php artisan optimize:clear

echo "Güncelleme tamamlandı!"

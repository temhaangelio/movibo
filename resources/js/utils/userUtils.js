/**
 * Kullanıcı isimlerinin baş harflerini büyütür
 * @param {string} name - Kullanıcı adı
 * @param {number} maxLength - Maksimum karakter sayısı (varsayılan: 2)
 * @returns {string} Baş harfler
 */
export const getInitials = (name, maxLength = 2) => {
    if (!name || typeof name !== "string") {
        return "";
    }

    // Önce tüm metni küçük harfe çevir
    const lowerName = name.toLowerCase();

    // Boşluklara göre kelimeleri ayır
    const words = lowerName.trim().split(/\s+/);

    // Her kelimenin ilk harfini al ve büyük yap
    const initials = words
        .map((word) => {
            if (word.length > 0) {
                // İlk harfi büyük yap
                return word.charAt(0).toUpperCase();
            }
            return "";
        })
        .filter((initial) => initial.length > 0);

    // Maksimum uzunluğa göre kısalt
    return initials.slice(0, maxLength).join("");
};

/**
 * Kullanıcı adının kısaltmasını oluşturur (profil fotoğrafı için)
 * @param {string} name - Kullanıcı adı
 * @returns {string} Kısaltma (maksimum 2 karakter)
 */
export const getDisplayInitials = (name) => {
    return getInitials(name, 2);
};

/**
 * Kullanıcı adının tam kısaltmasını oluşturur
 * @param {string} name - Kullanıcı adı
 * @returns {string} Tam kısaltma
 */
export const getFullInitials = (name) => {
    return getInitials(name, 10); // Maksimum 10 karakter
};

/**
 * Kullanıcı adını formatlar (ilk harfler büyük)
 * @param {string} name - Kullanıcı adı
 * @returns {string} Formatlanmış ad
 */
export const formatName = (name) => {
    if (!name || typeof name !== "string") {
        return "";
    }

    return name
        .toLowerCase()
        .split(" ")
        .map((word) => {
            if (word.length > 0) {
                const firstChar = word.charAt(0).toUpperCase();
                return firstChar + word.slice(1);
            }
            return word;
        })
        .join(" ");
};

/**
 * Kullanıcı adının geçerli olup olmadığını kontrol eder
 * @param {string} name - Kullanıcı adı
 * @returns {boolean} Geçerli mi
 */
export const isValidName = (name) => {
    if (!name || typeof name !== "string") {
        return false;
    }

    // En az 2 karakter, sadece harf ve boşluk
    const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s]{2,}$/;
    return nameRegex.test(name.trim());
};

/**
 * Kullanıcı adının uzunluğunu kontrol eder
 * @param {string} name - Kullanıcı adı
 * @param {number} minLength - Minimum uzunluk (varsayılan: 2)
 * @param {number} maxLength - Maksimum uzunluk (varsayılan: 50)
 * @returns {boolean} Uzunluk uygun mu
 */
export const isNameLengthValid = (name, minLength = 2, maxLength = 50) => {
    if (!name || typeof name !== "string") {
        return false;
    }

    const trimmedName = name.trim();
    return trimmedName.length >= minLength && trimmedName.length <= maxLength;
};

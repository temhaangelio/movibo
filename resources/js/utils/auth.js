import { usePage } from "@inertiajs/react";

/**
 * Kullanıcının admin olup olmadığını kontrol eder
 * @returns {boolean}
 */
export const useIsAdmin = () => {
    const { auth } = usePage().props;
    return auth?.user?.is_admin === true;
};

/**
 * Kullanıcının giriş yapmış olup olmadığını kontrol eder
 * @returns {boolean}
 */
export const useIsAuthenticated = () => {
    const { auth } = usePage().props;
    return !!auth?.user;
};

/**
 * Mevcut kullanıcıyı döndürür
 * @returns {object|null}
 */
export const useCurrentUser = () => {
    const { auth } = usePage().props;
    return auth?.user || null;
};

/**
 * Admin kontrolü için HOC (Higher Order Component)
 * @param {React.Component} Component - Sarmalanacak bileşen
 * @param {React.Component} FallbackComponent - Admin değilse gösterilecek bileşen
 * @returns {React.Component}
 */
export const withAdminCheck = (Component, FallbackComponent = null) => {
    return (props) => {
        const isAdmin = useIsAdmin();
        
        if (!isAdmin) {
            return FallbackComponent ? <FallbackComponent {...props} /> : null;
        }
        
        return <Component {...props} />;
    };
};

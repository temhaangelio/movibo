import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const TimeAgo = ({ date, className = "" }) => {
    const { t } = useTranslation();
    const [timeAgo, setTimeAgo] = useState("");

    useEffect(() => {
        const updateTimeAgo = () => {
            const now = new Date();
            const targetDate = new Date(date);
            const diffInSeconds = Math.floor((now - targetDate) / 1000);

            let result = "";

            if (diffInSeconds < 60) {
                result = t("just_now", "Az önce");
            } else if (diffInSeconds < 3600) {
                const minutes = Math.floor(diffInSeconds / 60);
                result = t("minutes_ago", "{{minutes}} dakika önce", { minutes });
            } else if (diffInSeconds < 86400) {
                const hours = Math.floor(diffInSeconds / 3600);
                result = t("hours_ago", "{{hours}} saat önce", { hours });
            } else if (diffInSeconds < 2592000) {
                const days = Math.floor(diffInSeconds / 86400);
                result = t("days_ago", "{{days}} gün önce", { days });
            } else if (diffInSeconds < 31536000) {
                const months = Math.floor(diffInSeconds / 2592000);
                result = t("months_ago", "{{months}} ay önce", { months });
            } else {
                const years = Math.floor(diffInSeconds / 31536000);
                result = t("years_ago", "{{years}} yıl önce", { years });
            }

            setTimeAgo(result);
        };

        // İlk hesaplama
        updateTimeAgo();

        // Her dakika güncelle
        const interval = setInterval(updateTimeAgo, 60000);

        return () => clearInterval(interval);
    }, [date, t]);

    return (
        <time 
            dateTime={new Date(date).toISOString()} 
            className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}
            title={new Date(date).toLocaleString()}
        >
            {timeAgo}
        </time>
    );
};

export default TimeAgo;

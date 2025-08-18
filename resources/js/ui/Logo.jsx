export default function ApplicationLogo({ className, ...props }) {
    const baseClasses = "font-black";
    const colorClasses = className || "font-black";
    return (
        <div className={`${baseClasses} ${colorClasses}`} {...props}>
            movibo
        </div>
    );
}

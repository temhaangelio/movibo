import { Transition } from "@headlessui/react";
import { Link } from "@inertiajs/react";
import { createContext, useContext, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

const DropDownContext = createContext();

const Dropdown = ({ children, usePortal = false }) => {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);

    const toggleOpen = () => {
        if (!open && usePortal && triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + window.scrollY,
                left: rect.right - 256, // 256px = w-64 genişliği
            });
        }
        setOpen((previousState) => !previousState);
    };

    return (
        <DropDownContext.Provider
            value={{
                open,
                setOpen,
                toggleOpen,
                usePortal,
                position,
                triggerRef,
            }}
        >
            <div className="relative">{children}</div>
        </DropDownContext.Provider>
    );
};

const Trigger = ({ children }) => {
    const { open, setOpen, toggleOpen, triggerRef } =
        useContext(DropDownContext);

    return (
        <>
            <div ref={triggerRef} onClick={toggleOpen}>
                {children}
            </div>

            {open && (
                <div
                    className="fixed inset-0 z-[9998]"
                    onClick={() => setOpen(false)}
                ></div>
            )}
        </>
    );
};

const Content = ({
    align = "right",
    width = "48",
    contentClasses = "py-1 bg-white dark:bg-gray-800",
    children,
}) => {
    const { open, setOpen, usePortal, position } = useContext(DropDownContext);

    let alignmentClasses = "origin-top";

    if (align === "left") {
        alignmentClasses = "ltr:origin-top-left rtl:origin-top-right start-0";
    } else if (align === "right") {
        alignmentClasses = "ltr:origin-top-right rtl:origin-top-left end-0";
    }

    let widthClasses = "";

    if (width === "48") {
        widthClasses = "w-48";
    } else if (width === "56") {
        widthClasses = "w-56";
    } else if (width === "64") {
        widthClasses = "w-64";
    } else if (width === "72") {
        widthClasses = "w-72";
    } else if (width === "80") {
        widthClasses = "w-80";
    } else if (width === "96") {
        widthClasses = "w-96";
    } else if (width === "auto") {
        widthClasses = "w-auto min-w-max";
    }

    const dropdownContent = (
        <Transition
            show={open}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
        >
            <div
                className={`${
                    usePortal ? "fixed" : "absolute"
                } z-[999999] mt-2 rounded-md shadow-lg ${alignmentClasses} ${widthClasses} max-h-60 overflow-y-auto`}
                onClick={() => setOpen(false)}
                style={{
                    minWidth: width === "auto" ? "auto" : undefined,
                    maxWidth: "300px",
                    transform: "translateX(0)",
                    right: align === "right" && !usePortal ? "0" : undefined,
                    left: align === "left" && !usePortal ? "0" : undefined,
                    top: usePortal ? position.top : undefined,
                    left: usePortal ? position.left : undefined,
                    zIndex: 999999,
                }}
            >
                <div
                    className={
                        `rounded-md ring-1 ring-black ring-opacity-5 ` +
                        contentClasses
                    }
                >
                    {children}
                </div>
            </div>
        </Transition>
    );

    if (usePortal && open) {
        return createPortal(dropdownContent, document.body);
    }

    return dropdownContent;
};

const DropdownLink = ({ className = "", children, href, method, ...props }) => {
    return (
        <Link
            href={href}
            method={method}
            {...props}
            className={
                "block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 transition duration-150 ease-in-out hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700 focus:outline-none " +
                className
            }
        >
            {children}
        </Link>
    );
};

Dropdown.Trigger = Trigger;
Dropdown.Content = Content;
Dropdown.Link = DropdownLink;

export default Dropdown;

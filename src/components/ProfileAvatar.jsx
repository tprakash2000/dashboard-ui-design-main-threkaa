import PropTypes from "prop-types";
import { cn } from "@/utils/cn";

export const ProfileAvatar = ({ name, image, size = "md", className }) => {
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase();
    };

    const sizeClasses = {
        sm: "size-8 text-sm",
        md: "size-10 text-base",
        lg: "size-20 text-xl",
    };

    if (image) {
        return (
            <div className={cn("overflow-hidden rounded-full", sizeClasses[size], className)}>
                <img
                    src={image}
                    alt={name}
                    className="size-full object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex items-center justify-center rounded-full bg-blue-100 font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400",
                sizeClasses[size],
                className
            )}
        >
            {getInitials(name)}
        </div>
    );
};

ProfileAvatar.propTypes = {
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    size: PropTypes.oneOf(["sm", "md", "lg"]),
    className: PropTypes.string,
}; 
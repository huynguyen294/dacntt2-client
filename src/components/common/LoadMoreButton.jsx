import { cn } from "@/lib/utils";
import { Button } from "@heroui/button";

/**
 * @property {*} form
 * @param {{
 *   variant: 'link' | 'light' | 'primary' | 'default' | 'flat',
 *   className: string,
 *   onLoadMore: () => {},
 * }} props
 */

const LoadMoreButton = ({
  size = "sm",
  radius = "full",
  color = "primary",
  variant = "light",
  className,
  onLoadMore = () => {},
}) => {
  return (
    <div className={cn("w-full flex justify-center", className)}>
      <Button radius={radius} color={color} size={size} className={className} variant={variant} onPress={onLoadMore}>
        Tải thêm
      </Button>
    </div>
  );
};

export default LoadMoreButton;

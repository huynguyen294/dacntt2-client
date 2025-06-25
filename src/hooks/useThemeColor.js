import { useEffect } from "react";

const defaultColor = "#fff";
const useThemeColor = (color) => {
  useEffect(() => {
    const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
    themeColorMetaTag.setAttribute("content", color);

    return () => {
      const themeColorMetaTag = document.querySelector('meta[name="theme-color"]');
      themeColorMetaTag.setAttribute("content", defaultColor);
    };
  }, [color]);
};

export default useThemeColor;

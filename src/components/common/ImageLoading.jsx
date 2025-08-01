import { memo, useEffect, useState } from "react";

const ImageLoading = ({ src, children }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const preload = () => {
      const img = new Image();
      img.onload = () => setReady(true);
      img.src = src;
    };

    src && preload();
  }, [src]);

  return children(ready || !src ? "" : "image-loading");
};

export default memo(ImageLoading);

import React, { memo } from "react";

function FooterComponent() {
  return (
    <span className="w-full text-gray-900 px-2 pb-2 md:pb-0 text-xs md:text-sm absolute bottom-0 md:bottom-2 flex items-center justify-center">
      © 2024 Copyright Easy Transfer, All rights reserved.
    </span>
  );
}

export default memo(FooterComponent);

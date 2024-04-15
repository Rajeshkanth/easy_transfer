import React, { memo } from "react";
import { Toaster } from "sonner";

function Toast() {
  return (
    <Toaster
      className="text-green-600"
      richColors
      toastOptions={{}}
      closeButton={true}
    />
  );
}

export default memo(Toast);

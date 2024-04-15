import React, { memo } from "react";

function ServerError() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-200 h-screen text-md text-gray-600">
      <span>Internal server error!</span>
      <span>Try again</span>
    </div>
  );
}

export default memo(ServerError);

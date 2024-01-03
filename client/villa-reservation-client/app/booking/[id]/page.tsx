import ConfirmationComponents from "@/app/components/Confirmation/ConfirmationComponents";
import NavigationBar from "@/app/components/NavigationBar";
import React from "react";

function ConfirmationPage() {
  return (
    <div className="min-h-screen bg-bg1 flex flex-col">
      <NavigationBar />
      <div className="flex-grow">
        <ConfirmationComponents />
      </div>
    </div>
  );
}

export default ConfirmationPage;

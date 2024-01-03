import NavigationBar from "@/app/components/NavigationBar";
import CheckoutVillaComponent from "@/app/components/Checkout/CheckoutVillaComponent";

function CheckoutVilla() {
  return (
    <div className="min-h-screen bg-bg1 flex flex-col">
      <NavigationBar />
      <div className="flex-grow">
        <CheckoutVillaComponent />
      </div>
    </div>
  );
}

export default CheckoutVilla;

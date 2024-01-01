import React from "react";
import NavigationBar from "../components/NavigationBar";
import TransactionList from "../components/Booking/TransactionList";

function BookingPage() {
  return (
    <>
      <NavigationBar />
      <div>BookingPage</div>
      <TransactionList />
    </>
  );
}

export default BookingPage;

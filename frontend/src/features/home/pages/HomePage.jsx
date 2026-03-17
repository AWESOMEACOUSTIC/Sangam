import React from "react";
import Hero from "../components/Hero";
import WhatToWatch from "../components/WhatToWatch";
import FreshOnDemand from "../components/FreshOnDemand";

function HomePage() {
  return (
    <div className="bg-black min-h-screen">
      <Hero />
      <WhatToWatch />
      <FreshOnDemand />
    </div>
  );
}

export default HomePage;
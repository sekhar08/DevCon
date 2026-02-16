"use client"

import Image from "next/image"

function ExploreBtn() {
  return (
    <button type="button" id="explore-btn" className="mt-7 mx-auto ">
      <a href="/events">Explore Events</a>
      <Image src={"/icons/arrow-down.svg"} width={16} height={16} alt="Arrow down icon" className="ml-2" />
    </button>
  )
}

export default ExploreBtn
"use client";

import Link from "next/link";
import Image from "next/image";

function ExploreBtn() {
  return (
    <Link href="/events" id="explore-btn" className="mt-7 mx-auto">
      <span>Explore events</span>
      <Image
        src={"/icons/arrow-down.svg"}
        width={16}
        height={16}
        alt="Arrow down icon"
        className="ml-2 animate-float"
      />
    </Link>
  );
}

export default ExploreBtn;
import Image from "next/image"
import Link from "next/link"


function Navbar() {
  return (
        <header>
            <nav>
                <Link href="/" className="logo">
                    <Image src="/icons/logo.png" width={24} height={24} alt="DevCon logo " />
                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href="/">Home</Link>
                    <Link href="/events">Event</Link>
                    <Link href="/createEvent">Create Event</Link>
                </ul>
            </nav>
        </header>
  )
}

export default Navbar
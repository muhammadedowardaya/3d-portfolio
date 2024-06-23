'use client';

import Link from 'next/link';
import NavLink from './NavLink';

export default function Navbar() {
	return (
		<header className='flex items-center justify-between absolute top-0 z-10 left-0 right-0 p-4'>
			<Link
				href="/"
				className="px-4 py-2 w-max flex items-center justify-center shadow-md rounded-lg bg-white font-bold"
			>
				<p>MEDOW</p>
			</Link>
			<nav className="flex text-lg gap-7 font-medium">
				<NavLink href="/about" exact>
					About
				</NavLink>
				<NavLink href="/projects" exact>
					Projects
				</NavLink>
				<NavLink href="/contact" exact>
					Contact
				</NavLink>
			</nav>
		</header>
	);
}

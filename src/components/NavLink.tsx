'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavLinkProps = {
	href: string;
	exact?: boolean;
	children: React.ReactNode;
};

const NavLink: React.FC<NavLinkProps> = ({ href, exact = false, children }) => {
	const pathname = usePathname();
	const isActive = exact ? pathname === href : pathname.startsWith(href);

	return (
		<Link href={href} passHref>
			<p className={isActive ? 'text-blue-400' : 'text-white'}>{children}</p>
		</Link>
	);
};

export default NavLink;

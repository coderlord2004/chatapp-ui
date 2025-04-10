import Link from 'next/link';

export default function Header() {
	return (
		<header className="fixed top-[5px] right-[5px] left-[5px] z-10 flex h-[50px] items-center rounded-[10px] bg-black/50 p-[5px] px-[10px]">
			<img
				src="./logo.jpeg"
				alt=""
				className="ml-[5%] h-full w-auto rounded-[50%] border-[1px] border-solid border-white"
			/>
			<div className="mx-auto flex w-[50%] justify-evenly">
				<Link href="/home">Home</Link>
				<button>Search</button>
				<button>Contact us</button>
				<button>Report</button>
			</div>
			<div className="flex items-center justify-center gap-[10px]">
				<Link href="/login">Log in</Link>
				<div className="h-[25px] w-[1px] bg-white"></div>
				<Link href="/signup">Sign up</Link>
			</div>
		</header>
	);
}

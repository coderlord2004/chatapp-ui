'use client';

function Logo() {
	return (
		<div className="relative h-auto w-auto">
			<img
				src="https://video-public.canva.com/VAFCQz1zbhs/v/fc502b099a.gif"
				className="h-[70px] min-w-auto"
			/>
			<img
				src="/logo.jpeg"
				className="absolute top-[20px] left-[20px] h-[30px] w-[30px] rounded-[50%]"
			/>
			<h1 className="gradientColor absolute top-[50%] left-[80px] translate-y-[-60%] transform">
				NextChat
			</h1>
		</div>
	);
}

export default Logo;

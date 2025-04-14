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
                className="absolute top-[20px] left-[20px] w-[30px] h-[30px] rounded-[50%]"
            />
            <h1 className="absolute top-[50%] left-[80px] translate-y-[-60%] transform bg-gradient-to-r from-[#D86587] to-[#54ABF4] bg-clip-text text-2xl font-bold text-transparent">
                NextChat
            </h1>
        </div>
    );
}

export default Logo;

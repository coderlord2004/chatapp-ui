import { FiCamera } from 'react-icons/fi';

type Props = {
    src: string | null;
}

export default function CoverPicture({ src }: Props) {
    return (
        <div className="relative h-64 w-full overflow-hidden md:h-80">
            {src ? (
                <img
                    src={src || ''}
                    alt="Cover"
                    className="h-full w-full object-cover"
                />
            ) : (
                <div className="h-full w-full bg-gradient-to-b from-slate-800 via-5% to-slate-300"></div>
            )}

            <div className="group absolute right-4 bottom-4 rounded-full bg-white/80 p-2.5 backdrop-blur-sm transition-all duration-300 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-700 flex items-center justify-center cursor-pointer">
                <FiCamera className="text-gray-700 group-hover:text-purple-600 dark:text-gray-300 dark:group-hover:text-purple-400" />
            </div>
        </div>
    )
}
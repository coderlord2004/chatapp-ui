import { useState, useRef, useEffect } from 'react';
import { IoSearch, IoClose, IoMic, IoMicOff } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import TextInput from './TextInput';
import { useRequest } from '@/hooks/useRequest';

interface SearchInputProps {
	onSearch: (keyword: string) => void;
	placeholder?: string;
	className?: string;
	autoFocus?: boolean;
}

type SearchHistoryType = {
	keyword: string;
	frequency: number;
};

export default function SearchInput({
	onSearch,
	placeholder = 'Tìm kiếm...',
	className = '',
	autoFocus = false,
}: SearchInputProps) {
	const [query, setQuery] = useState('');
	const [isFocused, setIsFocused] = useState(false);
	const [isListening, setIsListening] = useState(false);
	const [searchHistories, setSearchHistories] = useState<SearchHistoryType[]>(
		[],
	);
	const inputRef = useRef<HTMLInputElement>(null);
	const recognitionRef = useRef<any>(null);

	const { get } = useRequest();
	useEffect(() => {
		if (
			typeof window !== 'undefined' &&
			('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
		) {
			const SpeechRecognition =
				(window as any).SpeechRecognition ||
				(window as any).webkitSpeechRecognition;
			recognitionRef.current = new SpeechRecognition();
			recognitionRef.current.continuous = false;
			recognitionRef.current.interimResults = false;
			recognitionRef.current.lang = 'vi-VN';

			recognitionRef.current.onresult = (event: any) => {
				const transcript = event.results[0][0].transcript;
				setQuery(transcript);
				onSearch(transcript);
				setIsListening(false);
			};

			recognitionRef.current.onerror = () => {
				setIsListening(false);
			};

			recognitionRef.current.onend = () => {
				setIsListening(false);
			};
		}

		return () => {
			if (recognitionRef.current) {
				recognitionRef.current.stop();
			}
		};
	}, [onSearch]);

	useEffect(() => {
		async function getSearchHistory() {
			const data = await get('search/histories/');
			setSearchHistories(data);
		}
		getSearchHistory();
	}, []);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setQuery(value);
		onSearch(value);
	};

	const handleClear = () => {
		setQuery('');
		onSearch('');
		inputRef.current?.focus();
	};

	const toggleVoiceSearch = () => {
		if (!recognitionRef.current) {
			alert('Trình duyệt của bạn không hỗ trợ nhận dạng giọng nói');
			return;
		}

		if (isListening) {
			recognitionRef.current.stop();
			setIsListening(false);
		} else {
			recognitionRef.current.start();
			setIsListening(true);
		}
	};

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
	};

	return (
		<div className={`relative ${className}`}>
			{/* Main Search Container */}
			<motion.div
				className={`relative flex items-center overflow-hidden rounded-2xl border-2 bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg transition-all duration-300 ${
					isFocused
						? 'border-amber-400/60 shadow-lg shadow-amber-500/20'
						: 'border-slate-600/50 hover:border-slate-500/70'
				} `}
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
			>
				{/* Search Icon */}
				<div className="pr-3 pl-4">
					<IoSearch
						className={`text-xl transition-colors duration-100 ${isFocused ? 'text-amber-400' : 'text-slate-400'} `}
					/>
				</div>

				<input
					ref={inputRef}
					type="text"
					value={query}
					onChange={handleInputChange}
					onFocus={handleFocus}
					onBlur={handleBlur}
					placeholder={placeholder}
					autoFocus={autoFocus}
					className="w-full bg-transparent py-2 pr-4 text-sm font-medium text-white placeholder-slate-400 outline-none"
				/>

				{/* Action Buttons */}
				<div className="flex items-center space-x-1 pr-2">
					{/* Voice Search Button */}
					<motion.button
						onClick={toggleVoiceSearch}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
						className={`rounded-full p-2 transition-all duration-300 ${
							isListening
								? 'animate-pulse bg-red-500/20 text-red-400'
								: 'text-slate-400 hover:bg-amber-400/10 hover:text-amber-400'
						} `}
						title="Tìm kiếm bằng giọng nói"
					>
						{isListening ? (
							<IoMicOff className="text-lg" />
						) : (
							<IoMic className="text-lg" />
						)}
					</motion.button>

					{/* Clear Button */}
					<AnimatePresence>
						{query && (
							<motion.button
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								onClick={handleClear}
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								className="rounded-full p-2 text-slate-400 transition-all duration-300 hover:bg-red-400/10 hover:text-red-400"
								title="Xóa tìm kiếm"
							>
								<IoClose className="text-lg" />
							</motion.button>
						)}
					</AnimatePresence>
				</div>
			</motion.div>

			{/* Search Suggestions Dropdown */}
			<AnimatePresence>
				{isFocused && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800 to-slate-900 shadow-2xl shadow-black/50 backdrop-blur-lg"
					>
						<div className="border-b border-slate-700/50 p-3">
							<h3 className="flex items-center text-sm font-semibold text-slate-300">
								<span className="mr-2 h-4 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500"></span>
								Tìm kiếm gần đây
							</h3>
						</div>

						<div className="custom-scrollbar max-h-60 overflow-y-auto">
							{searchHistories.map((searchHistory, index) => (
								<motion.div
									key={searchHistory.keyword}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: index * 0.1 }}
									className="group flex cursor-pointer items-center justify-between border-l-2 border-transparent px-4 py-3 transition-all duration-200 hover:border-amber-400/60 hover:bg-slate-700/50"
									onClick={() => {
										setQuery(searchHistory.keyword);
										onSearch(searchHistory.keyword);
									}}
								>
									<div className="flex gap-2">
										<IoSearch className="mr-3 text-slate-400 transition-colors group-hover:text-amber-400" />
										<strong className="flex-1 text-slate-300 group-hover:text-white">
											{searchHistory.keyword + ' '}
											<span className="flex-1 text-[70%] text-amber-400 group-hover:text-white">
												{searchHistory.frequency} lần tìm kiếm
											</span>
										</strong>
									</div>
									<span className="text-xs text-slate-500 group-hover:text-slate-400">
										Nhấn để tìm
									</span>
								</motion.div>
							))}
						</div>

						{/* Quick Actions */}
						<div className="border-t border-slate-700/50 bg-slate-800/30 p-3">
							<div className="flex space-x-2">
								<span className="rounded-lg bg-slate-700/50 px-2 py-1 text-xs text-slate-400">
									⌘K
								</span>
								<span className="rounded-lg bg-slate-700/50 px-2 py-1 text-xs text-slate-400">
									ESC
								</span>
								<span className="rounded-lg bg-slate-700/50 px-2 py-1 text-xs text-slate-400">
									↑↓
								</span>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Voice Recognition Status */}
			<AnimatePresence>
				{isListening && (
					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.8 }}
						className="absolute top-full right-0 left-0 z-50 mt-2 rounded-2xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-pink-500/20 p-4 text-center backdrop-blur-lg"
					>
						<div className="flex items-center justify-center space-x-3">
							<div className="flex space-x-1">
								{[1, 2, 3].map((i) => (
									<motion.div
										key={i}
										animate={{
											scale: [1, 1.5, 1],
											opacity: [0.5, 1, 0.5],
										}}
										transition={{
											duration: 1,
											repeat: Infinity,
											delay: i * 0.2,
										}}
										className="h-2 w-2 rounded-full bg-red-400"
									/>
								))}
							</div>
							<span className="text-sm font-medium text-red-300">
								Đang nghe... Hãy nói nội dung tìm kiếm
							</span>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}

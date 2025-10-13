import { MouseEventHandler, useEffect, useRef, useState } from 'react';
import { FaFileAudio } from 'react-icons/fa6';
import { IoPlay } from 'react-icons/io5';

type Props = {
	name: string;
	src: string;
	description: string | null;
};

type AudioType = {
	isPlaying: boolean;
	currentTime: number;
	duration: number;
};

export default function AudioCard({ name, src, description }: Props) {
	const [audio, setAudio] = useState<AudioType | null>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	console.log(audio);

	function nextAudioTime() {
		setAudio((prev) => {
			if (!prev || !audioRef.current) return prev;
			return {
				...prev,
				isPlaying: true,
				currentTime: Math.min(prev.duration, prev.currentTime + 5),
			};
		});
	}

	function prevAudioTime() {
		setAudio((prev) => {
			if (!prev || !audioRef.current) return prev;
			return {
				...prev,
				isPlaying: true,
				currentTime: Math.max(0, prev.currentTime - 5),
			};
		});
	}

	useEffect(() => {
		if (!audioRef.current || !audio) return;
		const audioTag = audioRef.current;

		if (audio.isPlaying) {
			audioTag.play();
		} else {
			audioTag.pause();
		}
	}, [audio]);

	return (
		<div className="w-full max-w-sm p-4">
			<div className="group text-foreground hover:shadow-primary/20 relative overflow-hidden rounded-lg bg-black p-6 backdrop-blur-[2px] transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
				<div className="pointer-events-none absolute inset-0 z-0 h-full w-full rounded-lg shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
				<div className="glass-effect absolute inset-0 -z-10 h-full w-full overflow-hidden rounded-lg" />
				<div className="relative z-10">
					<div className="flex items-start gap-2">
						<div className="relative -mt-1.5 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-zinc-200 dark:bg-zinc-800">
							<FaFileAudio className="text-4xl text-slate-300" />

							<div className="absolute inset-0 rounded-2xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
						</div>
						<div className="flex-1">
							<div className="flex items-start justify-between gap-4">
								<div className="space-y-1.5">
									<p className="text-foreground leading-none font-semibold tracking-tight dark:text-white">
										{name}
									</p>
									<p className="text-muted-foreground/80 text-sm dark:text-zinc-400">
										{description}
									</p>
								</div>
							</div>
						</div>
					</div>
					<div className="text-foreground pt-6 dark:text-white">
						<div className="space-y-2">
							<div
								className="relative h-2.5 w-full rounded-full bg-zinc-200/50 dark:bg-zinc-800/50"
								role="presentation"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-zinc-300/20 via-zinc-300/30 to-zinc-300/20 dark:from-white/5 dark:via-white/10 dark:to-white/5" />
								<div
									className="absolute inset-y-0 left-0 flex rounded-full bg-gradient-to-r from-black/50 via-black/50 to-black/50 transition-all duration-200 ease-out dark:from-blue-400 dark:via-blue-200 dark:to-blue-500"
									style={{
										width: `${((audio?.currentTime || 0) / (audio?.duration || 1)) * 100}%`,
									}}
								>
									<div
										className="absolute top-[-3px] right-[-3px] h-4 w-4 cursor-pointer rounded-full bg-blue-500"
										onMouseDown={() =>
											setAudio((prev) =>
												prev
													? {
															...prev,
															isPlaying: false,
															currentTime: prev.currentTime,
															duration: prev.duration,
														}
													: null,
											)
										}
										onMouseUp={() =>
											setAudio((prev) =>
												prev
													? {
															...prev,
															isPlaying: true,
															currentTime: prev.currentTime,
															duration: prev.duration,
														}
													: null,
											)
										}
									/>
								</div>
							</div>

							<div className="flex justify-between text-xs font-medium">
								{audio && (
									<>
										<span className="text-zinc-600 tabular-nums dark:text-zinc-400">
											{Math.round(audio.currentTime * 100) / 100}
										</span>
										<span className="text-zinc-600 tabular-nums dark:text-zinc-400">
											{Math.round(audio.duration * 100) / 100}
										</span>
									</>
								)}
							</div>

							<audio
								ref={audioRef}
								src={src}
								className="hidden"
								controls
								onLoadedData={() =>
									setAudio({
										isPlaying: false,
										currentTime: 0,
										duration: audioRef.current?.duration || 0,
									})
								}
								onTimeUpdate={() =>
									setAudio({
										isPlaying: !audioRef.current?.paused,
										currentTime: audioRef.current?.currentTime || 0,
										duration: audioRef.current?.duration || 0,
									})
								}
							>
								No support for audio
							</audio>
						</div>

						<div className="mt-6 flex items-center justify-center gap-6">
							<button
								className="text-primary relative inline-flex h-9 w-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-transparent text-sm font-medium whitespace-nowrap text-zinc-600 transition-[color,box-shadow] duration-300 hover:scale-105 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
								aria-label="Previous track"
								onClick={prevAudioTime}
							>
								<div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
								<div className="glass-effect absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md" />
								<div className="pointer-events-none z-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={20}
										height={20}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="size-5"
									>
										<path d="m15 18-6-6 6-6" />
									</svg>
								</div>
							</button>
							<button
								className="text-primary relative inline-flex h-9 w-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-transparent text-sm font-medium whitespace-nowrap text-zinc-600 transition-[color,box-shadow] duration-300 hover:scale-105 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
								aria-label="Pause"
								onClick={() =>
									setAudio((prev) =>
										prev
											? {
													...prev,
													isPlaying: !prev.isPlaying,
												}
											: null,
									)
								}
							>
								<div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
								<div className="glass-effect absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md" />
								<div className="pointer-events-none z-10">
									{audio?.isPlaying ? (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width={20}
											height={20}
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth={2}
											strokeLinecap="round"
											strokeLinejoin="round"
											className="size-5"
										>
											<rect width={4} height={16} x={6} y={4} />
											<rect width={4} height={16} x={14} y={4} />
										</svg>
									) : (
										<IoPlay className="text-xl" />
									)}
								</div>
							</button>
							<button
								className="text-primary relative inline-flex h-9 w-9 cursor-pointer items-center justify-center gap-2 rounded-full bg-transparent text-sm font-medium whitespace-nowrap text-zinc-600 transition-[color,box-shadow] duration-300 hover:scale-105 hover:text-zinc-900 disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:text-zinc-100"
								aria-label="Next track"
								onClick={nextAudioTime}
							>
								<div className="absolute top-0 left-0 z-0 h-full w-full rounded-full shadow-[0_0_6px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3px_rgba(0,0,0,0.9),inset_-3px_-3px_0.5px_-3px_rgba(0,0,0,0.85),inset_1px_1px_1px_-0.5px_rgba(0,0,0,0.6),inset_-1px_-1px_1px_-0.5px_rgba(0,0,0,0.6),inset_0_0_6px_6px_rgba(0,0,0,0.12),inset_0_0_2px_2px_rgba(0,0,0,0.06),0_0_12px_rgba(255,255,255,0.15)] transition-all dark:shadow-[0_0_8px_rgba(0,0,0,0.03),0_2px_6px_rgba(0,0,0,0.08),inset_3px_3px_0.5px_-3.5px_rgba(255,255,255,0.09),inset_-3px_-3px_0.5px_-3.5px_rgba(255,255,255,0.85),inset_1px_1px_1px_-0.5px_rgba(255,255,255,0.6),inset_-1px_-1px_1px_-0.5px_rgba(255,255,255,0.6),inset_0_0_6px_6px_rgba(255,255,255,0.12),inset_0_0_2px_2px_rgba(255,255,255,0.06),0_0_12px_rgba(0,0,0,0.15)]" />
								<div className="glass-effect absolute top-0 left-0 isolate -z-10 h-full w-full overflow-hidden rounded-md" />
								<div className="pointer-events-none z-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width={20}
										height={20}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth={2}
										strokeLinecap="round"
										strokeLinejoin="round"
										className="size-5"
									>
										<path d="m9 18 6-6-6-6" />
									</svg>
								</div>
							</button>
						</div>
					</div>
				</div>
				<div className="pointer-events-none absolute inset-0 z-20 rounded-lg bg-gradient-to-r from-transparent via-black/5 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100 dark:via-white/5" />
			</div>
		</div>
	);
}

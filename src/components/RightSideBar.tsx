import FriendSuggestion from '@/components/FriendSuggestion';
import BarChart from '@/components/BarChart';

type Props = {};

export default function RightSideBar({}: Props) {
	return (
		<div className="fixed top-[70px] right-0 bottom-0 hidden flex-col gap-4 px-3 py-4 lg:flex lg:w-1/4 xl:w-1/5">
			<FriendSuggestion />

			<div className="rounded-2xl border border-gray-700 bg-gray-800/50 py-1.5 backdrop-blur-lg">
				<h3 className="mb-4 text-center font-semibold text-black dark:text-white">
					Trending Topics
				</h3>
				<BarChart />
			</div>

			<div className="space-y-2 text-xs text-gray-500">
				<div className="flex flex-wrap gap-2">
					{['Privacy', 'Terms', 'Advertising', 'Cookies'].map((item) => (
						<button
							key={item}
							className="transition-colors hover:text-gray-400"
						>
							{item}
						</button>
					))}
				</div>
				<p>© 2024 YourApp. All rights reserved.</p>
			</div>
		</div>
	);
}

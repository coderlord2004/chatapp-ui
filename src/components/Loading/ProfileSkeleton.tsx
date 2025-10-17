'use client';
import Skeleton from './Skeleton';

export default function ProfileSkeleton() {
	return (
		<div className="min-h-screen bg-gray-50 transition-colors duration-300 dark:bg-gray-900">
			<div className="relative z-10 mx-auto max-w-4xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
				<Skeleton height="200px" className="rounded-2xl" />

				<div className="flex flex-col items-center gap-6 md:flex-row md:items-end">
					<Skeleton circle height="120px" width="120px" />
					<div className="flex-1 space-y-3">
						<Skeleton height="28px" width="200px" />
						<Skeleton height="20px" width="150px" />
					</div>
				</div>

				<div className="rounded-xl border border-gray-100 bg-white p-6 shadow dark:border-gray-700 dark:bg-gray-800">
					<div className="space-y-3">
						<Skeleton count={3} />
					</div>
					<div className="mt-4 flex gap-6">
						<Skeleton height="20px" width="80px" />
						<Skeleton height="20px" width="100px" />
						<Skeleton height="20px" width="90px" />
					</div>
				</div>

				<div className="flex space-x-6 border-b border-gray-200 pb-2 dark:border-gray-700">
					<Skeleton height="24px" width="60px" />
					<Skeleton height="24px" width="60px" />
				</div>

				<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
					<Skeleton height="240px" className="rounded-lg" />
					<Skeleton height="240px" className="rounded-lg" />
					<Skeleton height="240px" className="rounded-lg" />
				</div>
			</div>
		</div>
	);
}

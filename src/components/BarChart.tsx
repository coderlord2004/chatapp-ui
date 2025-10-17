import { useRequest } from '@/hooks/useRequest';
import { ResponsiveBar } from '@nivo/bar';
import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/useTheme';

const data = [
	{ month: 'Tháng 1', doanhThu: 4000 },
	{ month: 'Tháng 2', doanhThu: 3000 },
	{ month: 'Tháng 3', doanhThu: 5000 },
];

type TopSearchType = {
	keyword: string;
	count: number;
};

export default function BarChart() {
	const { get } = useRequest();
	const [trending, setTrending] = useState<TopSearchType[]>([]);
	const { theme } = useTheme();

	useEffect(() => {
		async function fetchTopSearch() {
			const res = await get('search/top/', {
				params: {
					page: 1,
				},
			});
			setTrending(res);
		}
		fetchTopSearch();
	}, []);

	const chartTheme = {
		axis: {
			ticks: {
				text: {
					fill: theme === 'dark' ? '#ffffff' : '#000000',
				},
			},
			legend: {
				text: {
					fill: theme === 'dark' ? '#ffffff' : '#000000',
				},
			},
		},
		labels: {
			text: {
				fill: theme === 'dark' ? '#ffffff' : '#000000',
			},
		},
		tooltip: {
			container: {
				background: theme === 'dark' ? '#111827' : '#ffffff',
				color: theme === 'dark' ? '#ffffff' : '#000000',
			},
		},
	};

	const defs = [
		{
			id: 'grad-count',
			type: 'linearGradient',
			colors: [
				{ offset: 0, color: '#f59e0b' },
				{ offset: 100, color: '#10b981' },
			],
		},
	];

	const fill = [
		{
			match: {
				id: 'count',
			},
			id: 'grad-count',
		},
	];

	return (
		<div style={{ height: 210 }}>
			<ResponsiveBar
				data={trending}
				keys={['count']}
				indexBy="keyword"
				margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
				padding={0.4}
				defs={defs}
				fill={fill}
				theme={chartTheme}
				borderRadius={4}
				labelSkipWidth={12}
				labelTextColor={{ from: 'color', modifiers: [] }}
				axisBottom={{
					legend: 'Từ khóa tìm kiếm',
					legendPosition: 'middle',
					legendOffset: 40,
					tickRotation: -45,
				}}
				axisLeft={{
					legend: 'Lượt tìm kiếm',
					legendPosition: 'middle',
					legendOffset: -50,
				}}
				tooltip={({ id, value, indexValue }) => (
					<div
						style={{
							width: '150px',
							maxWidth: '200px',
							whiteSpace: 'nowrap',
							padding: 8,
							color: theme === 'dark' ? '#ffffff' : '#000000',
							background: theme === 'dark' ? '#000000' : '#ffffff',
						}}
					>
						<p>
							Từ khóa:{' '}
							<strong className="truncate text-amber-500">{indexValue}</strong>
						</p>
						<div>Lượt tìm kiếm: {value}</div>
					</div>
				)}
			/>
		</div>
	);
}

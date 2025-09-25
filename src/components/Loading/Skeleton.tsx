export default function Skeleton({
    className = "",
    circle = false,
    count = 1,
    height,
    width
}: {
    className?: string;
    circle?: boolean;
    count?: number;
    height?: string | number;
    width?: string | number;
}) {
    const elements = Array.from({ length: count }, (_, i) => i);

    return (
        <>
            {elements.map((_, index) => (
                <div
                    key={index}
                    className={`bg-gray-200 dark:bg-gray-700 animate-pulse ${circle ? 'rounded-full' : 'rounded-md'} ${className}`}
                    style={{
                        height: height || '1rem',
                        width: width || '100%',
                        ...(circle && { aspectRatio: '1/1' })
                    }}
                />
            ))}
        </>
    );
};